export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'viewer';

export interface FilterState {
  category: string;
  type: 'all' | 'income' | 'expense';
  searchQuery: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
