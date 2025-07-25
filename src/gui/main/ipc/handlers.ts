import { ipcMain } from 'electron';
import { PortService } from '../../../core/services/PortService.js';
import { ReserveOptions, PortFilter } from '../../../core/models/Port.js';

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

  // App operations
  ipcMain.handle('app:getVersion', () => {
    return process.env['npm_package_version'] || '1.0.0';
  });
}