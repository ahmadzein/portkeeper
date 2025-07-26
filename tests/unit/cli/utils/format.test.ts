import { formatError, formatTable } from '@cli/utils/format';
import { InvalidPortError } from '@core/models/Port';
import chalk from 'chalk';

// Disable chalk colors for testing
chalk.level = 0;

describe('CLI Format Utils', () => {
  describe('formatError', () => {
    it('should format PortError correctly', () => {
      const error = new InvalidPortError(70000);
      const formatted = formatError(error);
      expect(formatted).toContain('Error: Invalid port number: 70000');
    });

    it('should format generic Error correctly', () => {
      const error = new Error('Something went wrong');
      const formatted = formatError(error);
      expect(formatted).toContain('Error: Something went wrong');
    });

    it('should handle unknown errors', () => {
      const formatted = formatError('not an error object');
      expect(formatted).toContain('An unknown error occurred');
    });
  });

  describe('formatTable', () => {
    it('should format table with headers and rows', () => {
      const headers = ['Port', 'Project', 'Status'];
      const rows = [
        ['3000', 'my-app', 'reserved'],
        ['3001', 'api', 'in-use'],
      ];

      const table = formatTable(headers, rows);
      
      expect(table).toContain('Port');
      expect(table).toContain('Project');
      expect(table).toContain('Status');
      expect(table).toContain('3000');
      expect(table).toContain('my-app');
      expect(table).toContain('reserved');
    });

    it('should handle empty rows', () => {
      const headers = ['Port', 'Project'];
      const rows: string[][] = [];

      const table = formatTable(headers, rows);
      
      expect(table).toContain('Port');
      expect(table).toContain('Project');
    });

    it('should calculate column widths correctly', () => {
      const headers = ['A', 'B'];
      const rows = [
        ['very long content', 'short'],
        ['short', 'very long content'],
      ];

      const table = formatTable(headers, rows);
      
      // Should have enough space for the longest content
      expect(table).toContain('very long content');
    });
  });
});