import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, UserRole, FinancialSummary } from '../types';
import { mockTransactions, CATEGORIES } from '../lib/mockData';

interface FinanceContextType {
  transactions: Transaction[];
  role: UserRole;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: UserRole) => void;
  summary: FinancialSummary;
  categories: string[];
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('finance_role');
    return (saved as UserRole) || 'admin';
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  const addTransaction = (t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const summary: FinancialSummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (t.type === 'income') {
        totalIncome += t.amount;
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          monthlyIncome += t.amount;
        }
      } else {
        totalExpenses += t.amount;
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          monthlyExpenses += t.amount;
        }
      }
    });

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses,
    };
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setRole,
        summary,
        categories: CATEGORIES,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
