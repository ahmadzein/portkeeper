import chalk from 'chalk';
import { PortError } from '../../core/models/Port.js';

export function formatError(error: unknown): string {
  if (error instanceof PortError) {
    return chalk.red(`Error: ${error.message}`);
  }
  
  if (error instanceof Error) {
    return chalk.red(`Error: ${error.message}`);
  }
  
  return chalk.red('An unknown error occurred');
}

export function formatTable(headers: string[], rows: string[][]): string {
  // Calculate column widths
  const columnWidths = headers.map((header, i) => {
    const headerWidth = header.length;
    const maxRowWidth = Math.max(...rows.map(row => row[i]?.length || 0));
    return Math.max(headerWidth, maxRowWidth) + 2;
  });

  // Format header
  let output = '';
  output += chalk.bold(
    headers.map((header, i) => header.padEnd(columnWidths[i] || 10)).join('')
  ) + '\n';
  
  // Add separator
  output += chalk.gray(
    columnWidths.map(width => '─'.repeat(width - 1)).join('─')
  ) + '\n';

  // Format rows
  rows.forEach(row => {
    output += row.map((cell, i) => cell.padEnd(columnWidths[i] || 10)).join('') + '\n';
  });

  return output;
}