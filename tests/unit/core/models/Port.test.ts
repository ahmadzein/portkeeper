import {
  InvalidPortError,
  PortInUseError,
  PortReservedError,
  ProcessKillError,
} from '@core/models/Port';

describe('Port Model Errors', () => {
  describe('InvalidPortError', () => {
    it('should create error with correct message and code', () => {
      const error = new InvalidPortError(70000);
      expect(error.message).toBe('Invalid port number: 70000. Must be between 1 and 65535');
      expect(error.code).toBe('INVALID_PORT');
      expect(error.name).toBe('PortError');
    });
  });

  describe('PortInUseError', () => {
    it('should create error with correct message and code', () => {
      const error = new PortInUseError(3000);
      expect(error.message).toBe('Port 3000 is already in use');
      expect(error.code).toBe('PORT_IN_USE');
    });
  });

  describe('PortReservedError', () => {
    it('should create error with correct message and code', () => {
      const error = new PortReservedError(3000, 'my-project');
      expect(error.message).toBe('Port 3000 is reserved for project "my-project"');
      expect(error.code).toBe('PORT_RESERVED');
    });
  });

  describe('ProcessKillError', () => {
    it('should create error with correct message and code', () => {
      const error = new ProcessKillError(3000, 'Permission denied');
      expect(error.message).toBe('Failed to kill process on port 3000: Permission denied');
      expect(error.code).toBe('PROCESS_KILL_ERROR');
    });
  });
});