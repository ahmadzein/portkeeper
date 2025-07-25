import { exec } from 'child_process';
import { promisify } from 'util';
import { PortDatabase } from '../database/Database.js';
import {
  Port,
  PortStatus,
  ReserveOptions,
  PortFilter,
  ActivePort,
  InvalidPortError,
  PortInUseError,
  PortReservedError,
  ProcessKillError,
} from '../models/Port.js';

const execAsync = promisify(exec);

export class PortService {
  private db: PortDatabase;

  constructor() {
    this.db = PortDatabase.getInstance();
  }

  async checkPort(port: number): Promise<PortStatus> {
    this.validatePort(port);

    // Check database first
    const dbPort = this.getPortFromDb(port);
    if (dbPort && dbPort.status !== 'free') {
      return dbPort.status;
    }

    // Check if port is actually in use
    const isInUse = await this.isPortInUse(port);
    if (isInUse) {
      // Update database if needed
      if (dbPort) {
        this.updatePortStatus(port, 'in-use');
      }
      return 'in-use';
    }

    return 'free';
  }

  async reservePort(port: number, options: ReserveOptions): Promise<Port> {
    this.validatePort(port);

    const currentStatus = await this.checkPort(port);
    
    if (currentStatus === 'in-use') {
      throw new PortInUseError(port);
    }

    if (currentStatus === 'reserved') {
      const existingPort = this.getPortFromDb(port);
      if (existingPort && existingPort.projectName !== options.projectName) {
        throw new PortReservedError(port, existingPort.projectName);
      }
    }

    const portData: Port = {
      number: port,
      projectName: options.projectName,
      description: options.description,
      status: 'reserved',
      reservedAt: new Date(),
      tags: options.tags,
      autoRelease: options.autoRelease,
    };

    this.savePort(portData);
    return portData;
  }

  async releasePort(port: number): Promise<void> {
    this.validatePort(port);
    
    const db = this.db.getDb();
    db.prepare('DELETE FROM ports WHERE number = ?').run(port);
    db.prepare('DELETE FROM tags WHERE port_number = ?').run(port);
  }

  async listPorts(filter?: PortFilter): Promise<Port[]> {
    let query = 'SELECT * FROM ports WHERE 1=1';
    const params: any[] = [];

    if (filter?.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }

    if (filter?.projectName) {
      query += ' AND project_name LIKE ?';
      params.push(`%${filter.projectName}%`);
    }

    const db = this.db.getDb();
    const rows = db.prepare(query).all(...params);

    const ports = await Promise.all(
      rows.map(async (row: any) => {
        const port = this.rowToPort(row);
        
        // Update status if port is actually in use
        if (port.status === 'reserved' && await this.isPortInUse(port.number)) {
          port.status = 'in-use';
          this.updatePortStatus(port.number, 'in-use');
        }

        // Load tags
        const tags = db
          .prepare('SELECT tag FROM tags WHERE port_number = ?')
          .all(port.number)
          .map((t: any) => t.tag);
        
        port.tags = tags;
        return port;
      })
    );

    return ports;
  }

  async killProcess(port: number): Promise<void> {
    this.validatePort(port);

    const pid = await this.getProcessId(port);
    if (!pid) {
      throw new ProcessKillError(port, 'No process found');
    }

    try {
      process.kill(pid, 'SIGTERM');
      
      // Wait a bit and check if process is still running
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        process.kill(pid, 0); // Check if process exists
        // If we get here, process is still running, force kill
        process.kill(pid, 'SIGKILL');
      } catch {
        // Process is gone, which is what we want
      }

      // Update database
      this.updatePortStatus(port, 'free');
    } catch (error) {
      throw new ProcessKillError(port, (error as Error).message);
    }
  }

  async scanActivePorts(): Promise<ActivePort[]> {
    const platform = process.platform;
    let command: string;

    if (platform === 'darwin' || platform === 'linux') {
      command = 'lsof -i -P -n | grep LISTEN';
    } else if (platform === 'win32') {
      command = 'netstat -ano | findstr LISTENING';
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    try {
      const { stdout } = await execAsync(command);
      return this.parsePortScanOutput(stdout, platform);
    } catch (error) {
      // Command might fail if no ports are listening
      return [];
    }
  }

  private validatePort(port: number): void {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new InvalidPortError(port);
    }
  }

  private async isPortInUse(port: number): Promise<boolean> {
    const platform = process.platform;
    let command: string;

    if (platform === 'darwin' || platform === 'linux') {
      command = `lsof -i :${port} -P -n | grep LISTEN`;
    } else if (platform === 'win32') {
      command = `netstat -ano | findstr :${port}.*LISTENING`;
    } else {
      return false;
    }

    try {
      await execAsync(command);
      return true;
    } catch {
      return false;
    }
  }

  private async getProcessId(port: number): Promise<number | null> {
    const platform = process.platform;
    let command: string;

    if (platform === 'darwin' || platform === 'linux') {
      command = `lsof -i :${port} -P -n -t | head -1`;
    } else if (platform === 'win32') {
      command = `netstat -ano | findstr :${port}.*LISTENING`;
    } else {
      return null;
    }

    try {
      const { stdout } = await execAsync(command);
      
      if (platform === 'win32') {
        const match = stdout.match(/\s+(\d+)\s*$/m);
        return match ? parseInt(match[1]!, 10) : null;
      } else {
        return parseInt(stdout.trim(), 10);
      }
    } catch {
      return null;
    }
  }

  private parsePortScanOutput(output: string, platform: string): ActivePort[] {
    const ports: ActivePort[] = [];
    const lines = output.split('\n').filter(line => line.trim());

    for (const line of lines) {
      if (platform === 'win32') {
        const match = line.match(/:(\d+)\s+.*LISTENING\s+(\d+)/);
        if (match) {
          ports.push({
            number: parseInt(match[1]!, 10),
            pid: parseInt(match[2]!, 10),
          });
        }
      } else {
        const match = line.match(/.*:(\d+)\s+\(LISTEN\)/);
        if (match) {
          const pidMatch = line.match(/^\S+\s+(\d+)/);
          if (pidMatch) {
            ports.push({
              number: parseInt(match[1]!, 10),
              pid: parseInt(pidMatch[1]!, 10),
              processName: line.split(/\s+/)[0],
            });
          }
        }
      }
    }

    return ports;
  }

  private getPortFromDb(port: number): Port | null {
    const db = this.db.getDb();
    const row = db.prepare('SELECT * FROM ports WHERE number = ?').get(port);
    return row ? this.rowToPort(row) : null;
  }

  private savePort(port: Port): void {
    const db = this.db.getDb();
    
    db.prepare(`
      INSERT OR REPLACE INTO ports (number, project_name, description, status, pid, reserved_at, last_used, auto_release)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      port.number,
      port.projectName,
      port.description || null,
      port.status,
      port.pid || null,
      port.reservedAt.toISOString(),
      port.lastUsed ? port.lastUsed.toISOString() : null,
      port.autoRelease ? 1 : 0
    );

    // Save tags
    if (port.tags && port.tags.length > 0) {
      const deleteStmt = db.prepare('DELETE FROM tags WHERE port_number = ?');
      const insertStmt = db.prepare('INSERT INTO tags (port_number, tag) VALUES (?, ?)');
      
      deleteStmt.run(port.number);
      for (const tag of port.tags) {
        insertStmt.run(port.number, tag);
      }
    }
  }

  private updatePortStatus(port: number, status: PortStatus): void {
    const db = this.db.getDb();
    db.prepare('UPDATE ports SET status = ? WHERE number = ?').run(status, port);
  }

  private rowToPort(row: any): Port {
    return {
      number: row.number,
      projectName: row.project_name,
      description: row.description,
      status: row.status,
      pid: row.pid,
      reservedAt: new Date(row.reserved_at),
      lastUsed: row.last_used ? new Date(row.last_used) : undefined,
      autoRelease: row.auto_release === 1,
    };
  }
}