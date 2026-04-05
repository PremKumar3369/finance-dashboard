import { useState, useRef, useEffect } from 'react';
import {
  Search, Download, ChevronDown,
  FileText, FileJson, Tag, SlidersHorizontal, ArrowUpDown, Check,
} from 'lucide-react';
import type { FilterState, Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { exportAsCSV, exportAsPDF, exportAsJSON } from '../../lib/exportUtils';

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  filteredTransactions: Transaction[];
}

// ── Reusable animated dropdown ────────────────────────────────────────────────
interface DropdownOption { label: string; value: string; }

interface FilterDropdownProps {
  icon: React.ElementType;
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  active?: boolean; // true when a non-default value is selected
}

function FilterDropdown({ icon: Icon, label, value, options, onSelect, active }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 shadow-sm
          ${active
            ? 'bg-blue-50 dark:bg-zorvyn-blue/10 border-blue-400 dark:border-zorvyn-blue/50 text-blue-600 dark:text-zorvyn-blue'
            : 'bg-white dark:bg-[#ffffff0d] border-gray-200 dark:border-[#ffffff1a] text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
      >
        <Icon className="w-4 h-4" />
        <span>{selected?.label ?? label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel */}
      <div
        className={`absolute left-0 mt-2 min-w-[170px] bg-white dark:bg-zorvyn-card border border-gray-200 dark:border-[#ffffff1a] rounded-xl shadow-xl overflow-hidden z-30 transition-all duration-200 origin-top
          ${open ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'}`}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { onSelect(opt.value); setOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors
              ${opt.value === value
                ? 'bg-blue-50 dark:bg-zorvyn-blue/10 text-blue-600 dark:text-zorvyn-blue'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#ffffff1a]'
              }`}
          >
            <span>{opt.label}</span>
            {opt.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TransactionFilters({ filters, onChange, filteredTransactions }: FiltersProps) {
  const { categories } = useFinance();
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilterDescription = () => {
    const parts: string[] = [];
    if (filters.category) parts.push(filters.category.toLowerCase());
    if (filters.type !== 'all') parts.push(filters.type);
    if (filters.searchQuery) parts.push('filtered');
    return parts.join('_') || undefined;
  };

  const handleExport = (type: 'csv' | 'pdf' | 'json') => {
    const desc = getFilterDescription();
    if (type === 'csv') exportAsCSV(filteredTransactions, desc);
    if (type === 'pdf') exportAsPDF(filteredTransactions, desc);
    if (type === 'json') exportAsJSON(filteredTransactions, desc);
    setExportOpen(false);
  };

  const categoryOptions: DropdownOption[] = [
    { label: 'All Categories', value: '' },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  const typeOptions: DropdownOption[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  const sortOptions: DropdownOption[] = [
    { label: 'Date (Newest)', value: 'date-desc' },
    { label: 'Date (Oldest)', value: 'date-asc' },
    { label: 'Amount (High)', value: 'amount-desc' },
    { label: 'Amount (Low)', value: 'amount-asc' },
  ];

  const exportOptions = [
    { type: 'csv' as const, label: 'Export as CSV', icon: Download, desc: 'Spreadsheet compatible' },
    { type: 'pdf' as const, label: 'Export as PDF', icon: FileText, desc: 'Print-ready report' },
    { type: 'json' as const, label: 'Export as JSON', icon: FileJson, desc: 'Raw data format' },
  ];

  const disabled = filteredTransactions.length === 0;

  return (
    <div className="flex flex-wrap gap-3 items-center">

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.searchQuery}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-[#ffffff1a] bg-white dark:bg-[#ffffff0d] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Category */}
      <FilterDropdown
        icon={Tag}
        label="Category"
        value={filters.category}
        options={categoryOptions}
        onSelect={(v) => onChange({ ...filters, category: v })}
        active={!!filters.category}
      />

      {/* Type */}
      <FilterDropdown
        icon={SlidersHorizontal}
        label="Type"
        value={filters.type}
        options={typeOptions}
        onSelect={(v) => onChange({ ...filters, type: v as FilterState['type'] })}
        active={filters.type !== 'all'}
      />

      {/* Sort */}
      <FilterDropdown
        icon={ArrowUpDown}
        label="Sort"
        value={`${filters.sortBy}-${filters.sortOrder}`}
        options={sortOptions}
        onSelect={(v) => {
          const [sortBy, sortOrder] = v.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
          onChange({ ...filters, sortBy, sortOrder });
        }}
        active={filters.sortBy !== 'date' || filters.sortOrder !== 'desc'}
      />

      {/* Export */}
      <div className="relative" ref={exportRef}>
        <button
          onClick={() => setExportOpen((p) => !p)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zorvyn-blue text-white text-sm font-medium hover:bg-zorvyn-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exportOpen ? 'rotate-180' : ''}`} />
        </button>

        <div
          className={`absolute right-0 mt-2 w-52 bg-white dark:bg-zorvyn-card border border-gray-200 dark:border-[#ffffff1a] rounded-xl shadow-xl overflow-hidden z-30 transition-all duration-200 origin-top max-sm:right-auto max-sm:left-0
            ${exportOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'}`}
        >
          {exportOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleExport(opt.type)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#ffffff1a] transition-colors text-gray-700 dark:text-gray-200"
            >
              <opt.icon className="w-4 h-4 text-blue-500" />
              <div className="text-left">
                <div className="font-medium">{opt.label}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
