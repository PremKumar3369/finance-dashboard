import { X, Keyboard } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
const mod = isMac ? '⌘' : 'Ctrl';

const shortcuts = [
  { keys: [mod, 'K'], description: 'Add new transaction (Admin only)' },
  { keys: [mod, 'D'], description: 'Toggle dark / light mode' },
  { keys: ['1'], description: 'Go to Dashboard' },
  { keys: ['2'], description: 'Go to Transactions' },
  { keys: ['3'], description: 'Go to Insights' },
  { keys: ['Shift', '?'], description: 'Show this shortcuts panel' },
  { keys: ['Esc'], description: 'Close any open modal' },
];

export default function ShortcutsHelpModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white dark:bg-zorvyn-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-600 dark:text-zorvyn-blue" />
            <h2 className="text-lg font-bold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#ffffff0d] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcut rows */}
        <div className="space-y-1">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#ffffff0d]/50 transition-colors"
            >
              <span className="text-sm text-gray-700 dark:text-gray-100">{s.description}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((key, ki) => (
                  <kbd
                    key={ki}
                    className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-[#ffffff0d] border border-gray-300 dark:border-[#ffffff1a] rounded shadow-sm text-gray-800 dark:text-gray-100"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-[#ffffff1a] text-center">
          <p className="text-xs text-gray-400 dark:text-zorvyn-muted">
            Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-[#ffffff0d] border border-gray-300 dark:border-[#ffffff1a] rounded">Shift + ?</kbd> anytime to toggle this
          </p>
        </div>
      </div>
    </div>
  );
}
