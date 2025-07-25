import { contextBridge, ipcRenderer } from 'electron';
import type { Port, PortStatus, ReserveOptions, PortFilter, ActivePort } from '../../core/models/Port';

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