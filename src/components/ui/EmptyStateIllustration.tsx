interface Props {
  type?: 'no-data' | 'no-results';
}

export default function EmptyStateIllustration({ type = 'no-data' }: Props) {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-40 h-32 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document */}
      <rect x="55" y="20" width="90" height="110" rx="8" className="fill-gray-100 dark:fill-gray-700" />
      <rect x="55" y="20" width="90" height="22" rx="8" className="fill-blue-500 dark:fill-blue-600" />
      <rect x="55" y="34" width="90" height="8" className="fill-blue-500 dark:fill-blue-600" />

      {/* Lines representing rows */}
      <rect x="68" y="54" width="64" height="6" rx="3" className="fill-gray-200 dark:fill-gray-600" />
      <rect x="68" y="67" width="48" height="6" rx="3" className="fill-gray-200 dark:fill-gray-600" />
      <rect x="68" y="80" width="56" height="6" rx="3" className="fill-gray-200 dark:fill-gray-600" />
      <rect x="68" y="93" width="40" height="6" rx="3" className="fill-gray-200 dark:fill-gray-600" />

      {type === 'no-results' ? (
        /* Magnifying glass with X */
        <>
          <circle cx="148" cy="118" r="18" className="fill-white dark:fill-gray-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="4" />
          <line x1="141" y1="111" x2="155" y2="125" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" strokeLinecap="round" />
          <line x1="155" y1="111" x2="141" y2="125" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" strokeLinecap="round" />
          <line x1="160" y1="130" x2="170" y2="140" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        /* Plus circle for "add first transaction" */
        <>
          <circle cx="148" cy="118" r="18" className="fill-blue-500 dark:fill-blue-600" />
          <line x1="148" y1="109" x2="148" y2="127" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="139" y1="118" x2="157" y2="118" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
