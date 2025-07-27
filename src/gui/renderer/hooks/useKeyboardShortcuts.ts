import { useEffect } from 'react';
import { usePortStore } from '@store/portStore';
import { message } from 'antd';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (onNewPort?: () => void) => {
  const { refreshPorts } = usePortStore();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'r',
      ctrl: true,
      cmd: true,
      action: () => {
        refreshPorts();
        message.info('Ports refreshed');
      },
      description: 'Refresh ports',
    },
    {
      key: 'n',
      ctrl: true,
      cmd: true,
      action: () => {
        if (onNewPort) {
          onNewPort();
        }
      },
      description: 'Reserve new port',
    },
    {
      key: 'f',
      ctrl: true,
      cmd: true,
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      },
      description: 'Focus search',
    },
    {
      key: '?',
      shift: true,
      action: () => {
        // Show help modal
        const shortcutText = shortcuts
          .map(s => {
            const keys = [];
            if (s.ctrl || s.cmd) keys.push('⌘/Ctrl');
            if (s.shift) keys.push('Shift');
            keys.push(s.key.toUpperCase());
            return `${keys.join('+')} - ${s.description}`;
          })
          .join('\n');
        
        message.info(`Keyboard Shortcuts:\n\n${shortcutText}`, 10);
      },
      description: 'Show help',
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      for (const shortcut of shortcuts) {
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
        
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!shortcut.ctrl || ctrlKey) &&
          (!shortcut.cmd || e.metaKey) &&
          (!shortcut.shift || e.shiftKey) &&
          (!shortcut.alt || e.altKey)
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [refreshPorts, onNewPort]);

  return { shortcuts };
};