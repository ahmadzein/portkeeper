import { PortDatabase } from '@core/database/Database';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// Use a test database for all tests
let testDbPath: string;

beforeAll(() => {
  // Create a temporary directory for test database
  testDbPath = mkdtempSync(join(tmpdir(), 'portmanager-test-'));
  process.env.PORTMANAGER_DB_PATH = join(testDbPath, 'test.db');
});

afterAll(() => {
  // Clean up test database
  try {
    const db = PortDatabase.getInstance();
    db.close();
  } catch (error) {
    // Ignore errors during cleanup
  }

  // Remove temporary directory
  if (testDbPath) {
    rmSync(testDbPath, { recursive: true, force: true });
  }
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};