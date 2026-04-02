interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
  prefix?: string;
  suffix?: string;
}

export default function ChartTooltip({ active, payload, label, prefix = '$', suffix = '' }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zorvyn-card border border-gray-200 dark:border-[#ffffff1a] rounded-lg shadow-lg px-3 py-2 text-sm">
      {label && <div className="font-medium text-gray-600 dark:text-gray-200 mb-1">{label}</div>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || '#2563eb' }} />
          <span className="text-gray-500 dark:text-zorvyn-muted">{entry.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {prefix}{Number(entry.value).toLocaleString()}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
}
