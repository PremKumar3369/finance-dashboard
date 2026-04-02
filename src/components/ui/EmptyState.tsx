import EmptyStateIllustration from './EmptyStateIllustration';

interface Props {
  title: string;
  description: string;
  type?: 'no-data' | 'no-results';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, description, type = 'no-data', action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
      <div className="mb-5 opacity-80">
        <EmptyStateIllustration type={type} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-zorvyn-muted max-w-xs mb-5">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
