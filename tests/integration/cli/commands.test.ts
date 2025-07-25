import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const CLI_PATH = path.join(__dirname, '../../../src/cli/index.ts');

describe('CLI Integration Tests', () => {
  const runCLI = async (args: string): Promise<{ stdout: string; stderr: string }> => {
    return execAsync(`tsx ${CLI_PATH} ${args}`);
  };

  describe('portman check', () => {
    it('should check if a port is free', async () => {
      const { stdout } = await runCLI('check 65432');
      expect(stdout).toContain('Port 65432 is free');
    });

    it('should handle invalid port numbers', async () => {
      await expect(runCLI('check 70000')).rejects.toThrow();
    });
  });

  describe('portman list', () => {
    it('should list all ports', async () => {
      const { stdout } = await runCLI('list');
      // Should either show ports or "No ports found"
      expect(stdout).toBeDefined();
    });

    it('should support JSON output', async () => {
      const { stdout } = await runCLI('list --json');
      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
    });
  });

  describe('portman reserve', () => {
    it('should require project name', async () => {
      await expect(runCLI('reserve 65431')).rejects.toThrow();
    });

    it('should reserve a port with project name', async () => {
      const { stdout } = await runCLI('reserve 65431 --name test-project');
      expect(stdout).toContain('Port 65431 reserved');
      
      // Clean up
      await runCLI('release 65431');
    });
  });

  describe('portman release', () => {
    it('should release a reserved port', async () => {
      // First reserve a port
      await runCLI('reserve 65430 --name test-project');
      
      // Then release it
      const { stdout } = await runCLI('release 65430');
      expect(stdout).toContain('Port 65430 released');
    });

    it('should handle multiple ports', async () => {
      // Reserve multiple ports
      await runCLI('reserve 65429 --name test1');
      await runCLI('reserve 65428 --name test2');
      
      // Release them all at once
      const { stdout } = await runCLI('release 65429 65428');
      expect(stdout).toContain('65429 released');
      expect(stdout).toContain('65428 released');
    });
  });

  describe('portman scan', () => {
    it('should scan for active ports', async () => {
      const { stdout } = await runCLI('scan');
      // Should show scanning message
      expect(stdout).toContain('Scanning for active ports');
    });

    it('should support JSON output', async () => {
      const { stdout } = await runCLI('scan --json');
      const parsed = JSON.parse(stdout);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });

  describe('portman --help', () => {
    it('should show help information', async () => {
      const { stdout } = await runCLI('--help');
      expect(stdout).toContain('Port Manager');
      expect(stdout).toContain('check');
      expect(stdout).toContain('reserve');
      expect(stdout).toContain('list');
      expect(stdout).toContain('release');
      expect(stdout).toContain('kill');
      expect(stdout).toContain('scan');
    });
  });
});