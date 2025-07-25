import { PortService } from '@core/services/PortService';
import { PortDatabase } from '@core/database/Database';
import { InvalidPortError, PortInUseError, PortReservedError } from '@core/models/Port';

// Mock the database
jest.mock('@core/database/Database');

// Mock child_process
jest.mock('child_process', () => ({
  exec: jest.fn(),
  promisify: jest.fn(),
}));

describe('PortService', () => {
  let service: PortService;
  let mockDb: jest.Mocked<PortDatabase>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PortService();
    mockDb = PortDatabase.getInstance() as jest.Mocked<PortDatabase>;
  });

  describe('validatePort', () => {
    it('should throw InvalidPortError for port < 1', async () => {
      await expect(service.checkPort(0)).rejects.toThrow(InvalidPortError);
      await expect(service.checkPort(-1)).rejects.toThrow(InvalidPortError);
    });

    it('should throw InvalidPortError for port > 65535', async () => {
      await expect(service.checkPort(65536)).rejects.toThrow(InvalidPortError);
      await expect(service.checkPort(70000)).rejects.toThrow(InvalidPortError);
    });

    it('should throw InvalidPortError for non-integer ports', async () => {
      await expect(service.checkPort(3000.5)).rejects.toThrow(InvalidPortError);
      await expect(service.checkPort(NaN)).rejects.toThrow(InvalidPortError);
    });
  });

  describe('checkPort', () => {
    it('should return "free" for available port', async () => {
      const mockGet = jest.fn().mockReturnValue(null);
      mockDb.getDb = jest.fn().mockReturnValue({
        prepare: jest.fn().mockReturnValue({ get: mockGet }),
      });

      const status = await service.checkPort(3000);
      expect(status).toBe('free');
    });

    it('should return "reserved" for reserved port', async () => {
      const mockGet = jest.fn().mockReturnValue({
        number: 3000,
        project_name: 'test-project',
        status: 'reserved',
      });
      mockDb.getDb = jest.fn().mockReturnValue({
        prepare: jest.fn().mockReturnValue({ get: mockGet }),
      });

      const status = await service.checkPort(3000);
      expect(status).toBe('reserved');
    });
  });

  describe('reservePort', () => {
    it('should successfully reserve a free port', async () => {
      const mockGet = jest.fn().mockReturnValue(null);
      const mockRun = jest.fn();
      mockDb.getDb = jest.fn().mockReturnValue({
        prepare: jest.fn().mockReturnValue({ 
          get: mockGet,
          run: mockRun,
        }),
      });

      const port = await service.reservePort(3000, {
        projectName: 'test-project',
        description: 'Test description',
      });

      expect(port.number).toBe(3000);
      expect(port.projectName).toBe('test-project');
      expect(port.status).toBe('reserved');
    });

    it('should throw PortInUseError when port is in use', async () => {
      // Mock port as in use
      jest.spyOn(service, 'checkPort').mockResolvedValue('in-use');

      await expect(
        service.reservePort(3000, { projectName: 'test-project' })
      ).rejects.toThrow(PortInUseError);
    });

    it('should throw PortReservedError when port is reserved by another project', async () => {
      jest.spyOn(service, 'checkPort').mockResolvedValue('reserved');
      
      const mockGet = jest.fn().mockReturnValue({
        number: 3000,
        project_name: 'other-project',
        status: 'reserved',
      });
      mockDb.getDb = jest.fn().mockReturnValue({
        prepare: jest.fn().mockReturnValue({ get: mockGet }),
      });

      await expect(
        service.reservePort(3000, { projectName: 'test-project' })
      ).rejects.toThrow(PortReservedError);
    });
  });

  describe('releasePort', () => {
    it('should successfully release a port', async () => {
      const mockRun = jest.fn();
      mockDb.getDb = jest.fn().mockReturnValue({
        prepare: jest.fn().mockReturnValue({ run: mockRun }),
      });

      await service.releasePort(3000);
      expect(mockRun).toHaveBeenCalledTimes(2); // ports and tags tables
    });
  });

  describe('listPorts', () => {
    it('should return all ports when no filter provided', async () => {
      const mockAll = jest.fn().mockReturnValue([
        {
          number: 3000,
          project_name: 'project1',
          status: 'reserved',
          reserved_at: new Date().toISOString(),
        },
        {
          number: 3001,
          project_name: 'project2',
          status: 'in-use',
          reserved_at: new Date().toISOString(),
        },
      ]);

      mockDb.getDb = jest.fn().mockReturnValue({
        prepare: jest.fn().mockReturnValue({ 
          all: mockAll,
        }),
      });

      const ports = await service.listPorts();
      expect(ports).toHaveLength(2);
      expect(ports[0].number).toBe(3000);
      expect(ports[1].number).toBe(3001);
    });

    it('should filter ports by status', async () => {
      const mockAll = jest.fn().mockReturnValue([
        {
          number: 3000,
          project_name: 'project1',
          status: 'reserved',
          reserved_at: new Date().toISOString(),
        },
      ]);

      mockDb.getDb = jest.fn().mockReturnValue({
        prepare: jest.fn().mockReturnValue({ 
          all: mockAll,
        }),
      });

      const ports = await service.listPorts({ status: 'reserved' });
      expect(ports).toHaveLength(1);
      expect(ports[0].status).toBe('reserved');
    });
  });
});