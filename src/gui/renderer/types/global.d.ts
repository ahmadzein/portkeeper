import type { PortManagerAPI } from '../../preload';

declare global {
  interface Window {
    portManager: PortManagerAPI;
  }
}

export {};