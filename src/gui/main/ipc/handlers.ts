import { ipcMain, dialog, BrowserWindow } from 'electron';
import { PortService } from '../../../core/services/PortService.js';
import { ReserveOptions, PortFilter, RequestOptions } from '../../../core/models/Port.js';
import fs from 'fs/promises';

const portService = new PortService();

export function setupIpcHandlers(): void {
  // Port operations
  ipcMain.handle('port:check', async (_, port: number) => {
    try {
      return await portService.checkPort(port);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  ipcMain.handle('port:reserve', async (_, port: number, options: ReserveOptions) => {
    try {
      return await portService.reservePort(port, options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  ipcMain.handle('port:release', async (_, port: number) => {
    try {
      await portService.releasePort(port);
      return true;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  ipcMain.handle('port:list', async (_, filter?: PortFilter) => {
    try {
      return await portService.listPorts(filter);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  ipcMain.handle('port:kill', async (_, port: number) => {
    try {
      await portService.killProcess(port);
      return true;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  ipcMain.handle('port:scan', async () => {
    try {
      return await portService.scanActivePorts();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  // Export/Import operations
  ipcMain.handle('port:export', async () => {
    try {
      const ports = await portService.listPorts();
      const data = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        ports: ports.map(port => ({
          number: port.number,
          projectName: port.projectName,
          description: port.description,
          tags: port.tags,
          autoRelease: port.autoRelease
        }))
      };
      
      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  ipcMain.handle('port:import', async (_, data: any) => {
    try {
      if (!data.ports || !Array.isArray(data.ports)) {
        throw new Error('Invalid import data format');
      }
      
      const results = {
        imported: 0,
        skipped: 0,
        errors: [] as string[]
      };
      
      for (const portData of data.ports) {
        try {
          const status = await portService.checkPort(portData.number);
          if (status === 'free') {
            await portService.reservePort(portData.number, {
              projectName: portData.projectName,
              description: portData.description,
              tags: portData.tags,
              autoRelease: portData.autoRelease
            });
            results.imported++;
          } else {
            results.skipped++;
            results.errors.push(`Port ${portData.number} is already ${status}`);
          }
        } catch (err) {
          results.errors.push(`Failed to import port ${portData.number}: ${(err as Error).message}`);
        }
      }
      
      return results;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  // File dialog operations
  ipcMain.handle('dialog:showSaveDialog', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return null;
    
    const result = await dialog.showSaveDialog(win, {
      title: 'Export Port Configuration',
      defaultPath: `portmanager-export-${new Date().toISOString().split('T')[0]}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    return result;
  });

  ipcMain.handle('dialog:showOpenDialog', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return null;
    
    const result = await dialog.showOpenDialog(win, {
      title: 'Import Port Configuration',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });
    
    return result;
  });

  ipcMain.handle('file:write', async (_, filePath: string, data: string) => {
    try {
      await fs.writeFile(filePath, data, 'utf-8');
      return true;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  ipcMain.handle('file:read', async (_, filePath: string) => {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  // Request operations
  ipcMain.handle('port:request', async (_, options: RequestOptions) => {
    try {
      return await portService.requestPorts(options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  // App operations
  ipcMain.handle('app:getVersion', () => {
    return process.env['npm_package_version'] || '1.0.0';
  });
}