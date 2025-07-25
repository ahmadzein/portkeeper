import { contextBridge, ipcRenderer } from 'electron';
import type { Port, PortStatus, ReserveOptions, PortFilter, ActivePort, RequestOptions, RequestResult } from '../../core/models/Port';

// Define the API that will be exposed to the renderer
const api = {
  port: {
    check: (port: number): Promise<PortStatus> => 
      ipcRenderer.invoke('port:check', port),
    
    reserve: (port: number, options: ReserveOptions): Promise<Port> => 
      ipcRenderer.invoke('port:reserve', port, options),
    
    release: (port: number): Promise<boolean> => 
      ipcRenderer.invoke('port:release', port),
    
    list: (filter?: PortFilter): Promise<Port[]> => 
      ipcRenderer.invoke('port:list', filter),
    
    kill: (port: number): Promise<boolean> => 
      ipcRenderer.invoke('port:kill', port),
    
    scan: (): Promise<ActivePort[]> => 
      ipcRenderer.invoke('port:scan'),
    
    export: (): Promise<any> => 
      ipcRenderer.invoke('port:export'),
    
    import: (data: any): Promise<{ imported: number; skipped: number; errors: string[] }> => 
      ipcRenderer.invoke('port:import', data),
    
    request: (options: RequestOptions): Promise<RequestResult> => 
      ipcRenderer.invoke('port:request', options),
  },
  
  dialog: {
    showSaveDialog: (): Promise<Electron.SaveDialogReturnValue> => 
      ipcRenderer.invoke('dialog:showSaveDialog'),
    
    showOpenDialog: (): Promise<Electron.OpenDialogReturnValue> => 
      ipcRenderer.invoke('dialog:showOpenDialog'),
  },
  
  file: {
    write: (filePath: string, data: string): Promise<boolean> => 
      ipcRenderer.invoke('file:write', filePath, data),
    
    read: (filePath: string): Promise<string> => 
      ipcRenderer.invoke('file:read', filePath),
  },
  
  app: {
    getVersion: (): Promise<string> => 
      ipcRenderer.invoke('app:getVersion'),
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('portManager', api);

// Type definitions for TypeScript
export type PortManagerAPI = typeof api;