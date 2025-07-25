export type PortStatus = 'reserved' | 'in-use' | 'free';

export interface Port {
  number: number;
  projectName: string;
  description?: string;
  status: PortStatus;
  pid?: number;
  reservedAt: Date;
  lastUsed?: Date;
  tags?: string[];
  autoRelease?: boolean;
}

export interface ReserveOptions {
  projectName: string;
  description?: string;
  tags?: string[];
  autoRelease?: boolean;
}

export interface PortFilter {
  status?: PortStatus;
  projectName?: string;
  tags?: string[];
}

export interface ActivePort {
  number: number;
  pid: number;
  processName?: string;
  state?: string;
  address?: string;
}

export interface RequestOptions {
  count: number;
  projectName: string;
  description?: string;
  tags?: string[];
  sequential?: boolean;
  startPort?: number;
  endPort?: number;
  avoid?: number[];
}

export interface RequestResult {
  ports: Port[];
  summary: string;
}

export class PortError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PortError';
  }
}

export class PortInUseError extends PortError {
  constructor(port: number) {
    super(`Port ${port} is already in use`, 'PORT_IN_USE');
  }
}

export class PortReservedError extends PortError {
  constructor(port: number, projectName: string) {
    super(`Port ${port} is reserved for project "${projectName}"`, 'PORT_RESERVED');
  }
}

export class InvalidPortError extends PortError {
  constructor(port: number) {
    super(`Invalid port number: ${port}. Must be between 1 and 65535`, 'INVALID_PORT');
  }
}

export class ProcessKillError extends PortError {
  constructor(port: number, reason: string) {
    super(`Failed to kill process on port ${port}: ${reason}`, 'PROCESS_KILL_ERROR');
  }
}