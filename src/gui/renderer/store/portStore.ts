import { create } from 'zustand';
import type { Port, PortFilter, ActivePort } from '../../../core/models/Port';

interface PortState {
  ports: Port[];
  activePorts: ActivePort[];
  isLoading: boolean;
  error: string | null;
  filter: PortFilter;
  
  // Actions
  setPorts: (ports: Port[]) => void;
  setActivePorts: (ports: ActivePort[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: PortFilter) => void;
  
  // Async actions
  refreshPorts: () => Promise<void>;
  scanPorts: () => Promise<void>;
  reservePort: (port: number, options: any) => Promise<void>;
  releasePort: (port: number) => Promise<void>;
  killPort: (port: number) => Promise<void>;
}

export const usePortStore = create<PortState>((set, get) => ({
  ports: [],
  activePorts: [],
  isLoading: false,
  error: null,
  filter: {},

  setPorts: (ports) => set({ ports }),
  setActivePorts: (activePorts) => set({ activePorts }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilter: (filter) => set({ filter }),

  refreshPorts: async () => {
    const { filter } = get();
    set({ isLoading: true, error: null });
    
    try {
      const [ports, activePorts] = await Promise.all([
        window.portManager.port.list(filter),
        window.portManager.port.scan(),
      ]);
      
      set({ ports, activePorts, isLoading: false });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  scanPorts: async () => {
    try {
      const activePorts = await window.portManager.port.scan();
      set({ activePorts });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  reservePort: async (port, options) => {
    try {
      await window.portManager.port.reserve(port, options);
      await get().refreshPorts();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  releasePort: async (port) => {
    try {
      await window.portManager.port.release(port);
      await get().refreshPorts();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  killPort: async (port) => {
    try {
      await window.portManager.port.kill(port);
      await get().refreshPorts();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));