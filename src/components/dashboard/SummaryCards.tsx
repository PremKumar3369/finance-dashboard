import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { ElementType } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useCountUp } from '../../lib/useCountUp';

interface CardProps {
  title: string;
  amount: number;
  icon: ElementType;
  color: string;
  bg: string;
}

function SummaryCard({ title, amount, icon: Icon, color, bg }: CardProps) {
  const animated = useCountUp(Math.abs(amount), 1000);

  return (
    <div className="group bg-slate-50 dark:bg-zorvyn-card rounded-lg border border-gray-200 dark:border-[#ffffff1a] shadow-sm p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-default">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <div className={`p-2 rounded-md ${bg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className={`text-2xl font-bold font-mono ${amount < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
        {amount < 0 ? '-' : ''}${animated.toLocaleString()}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { summary } = useFinance();

  const cards = [
    {
      title: 'Total Balance',
      amount: summary.totalBalance,
      icon: DollarSign,
      color: 'text-blue-600 dark:text-zorvyn-blue',
      bg: 'bg-blue-50 dark:bg-zorvyn-blue/10',
    },
    {
      title: 'Total Income',
      amount: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-zorvyn-green',
      bg: 'bg-green-50 dark:bg-zorvyn-green/10',
    },
    {
      title: 'Total Expenses',
      amount: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}
