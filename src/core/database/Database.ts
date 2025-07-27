import Database from 'better-sqlite3';
import { join } from 'path';
import { homedir } from 'os';
import { mkdirSync } from 'fs';

export class PortDatabase {
  private db: Database.Database;
  private static instance: PortDatabase;

  private constructor() {
    const dbPath = this.getDbPath();
    this.ensureDbDirectory(dbPath);
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.migrate();
  }

  static getInstance(): PortDatabase {
    if (!PortDatabase.instance) {
      PortDatabase.instance = new PortDatabase();
    }
    return PortDatabase.instance;
  }

  private getDbPath(): string {
    const configDir = join(homedir(), '.portmanager');
    return join(configDir, 'ports.db');
  }

  private ensureDbDirectory(dbPath: string): void {
    const dir = dbPath.substring(0, dbPath.lastIndexOf('/'));
    mkdirSync(dir, { recursive: true });
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ports (
        number INTEGER PRIMARY KEY,
        project_name TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK(status IN ('reserved', 'in-use', 'free')) NOT NULL,
        pid INTEGER,
        reserved_at TEXT NOT NULL,
        last_used TEXT,
        auto_release INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        port_number INTEGER NOT NULL,
        tag TEXT NOT NULL,
        FOREIGN KEY (port_number) REFERENCES ports(number) ON DELETE CASCADE,
        UNIQUE(port_number, tag)
      );

      CREATE INDEX IF NOT EXISTS idx_ports_status ON ports(status);
      CREATE INDEX IF NOT EXISTS idx_ports_project ON ports(project_name);
      CREATE INDEX IF NOT EXISTS idx_tags_port ON tags(port_number);
    `);
  }

  getDb(): Database.Database {
    return this.db;
  }

  close(): void {
    this.db.close();
  }
}