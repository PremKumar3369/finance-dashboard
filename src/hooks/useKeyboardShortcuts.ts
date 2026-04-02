import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrl?: boolean;   // Ctrl key on Windows/Linux
  meta?: boolean;   // Cmd on Mac (also matches Ctrl for cross-platform)
  shift?: boolean;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire shortcuts when the user is typing in an input
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const metaMatch = shortcut.meta ? (e.metaKey || e.ctrlKey) : true;
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;

        if (keyMatch && metaMatch && ctrlMatch && shiftMatch) {
          // Allow Cmd/Ctrl combos even when typing (e.g. Cmd+K to open modal)
          if (isTyping && !shortcut.meta && !shortcut.ctrl) continue;
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
