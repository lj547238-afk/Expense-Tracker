import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ExpenseContext = createContext();

const CATEGORIES = [
  { name: 'Food & Dining', icon: '', color: '#f97316' },
  { name: 'Transport', icon: '', color: '#3b82f6' },
  { name: 'Housing', icon: '', color: '#8b5cf6' },
  { name: 'Entertainment', icon: '', color: '#ec4899' },
  { name: 'Healthcare', icon: '', color: '#10b981' },
  { name: 'Shopping', icon: '', color: '#f59e0b' },
  { name: 'Education', icon: '', color: '#06b6d4' },
  { name: 'Utilities', icon: '', color: '#84cc16' },
  { name: 'Savings', icon: '', color: '#14b8a6' },
  { name: 'Other', icon: '', color: '#6b7280' },
];

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('et_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('et_budget');
    return saved ? Number(saved) : 0;
  });

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('et_income');
    return saved ? Number(saved) : 0;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('et_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('et_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('et_budget', String(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('et_income', String(income));
  }, [income]);

  useEffect(() => {
    if (user) localStorage.setItem('et_user', JSON.stringify(user));
    else localStorage.removeItem('et_user');
  }, [user]);

  const addExpense = (expense) => {
    setExpenses(prev => [{ ...expense, id: uuidv4() }, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const editExpense = (id, updated) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const clearExpenses = () => {
    setExpenses([]);
    localStorage.setItem('et_expenses', JSON.stringify([]));
  };

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = income - totalExpenses;

  return (
    <ExpenseContext.Provider value={{
      expenses, addExpense, deleteExpense, editExpense, clearExpenses,
      budget, setBudget, income, setIncome,
      user, login, logout,
      totalExpenses, balance, categories: CATEGORIES
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
export { CATEGORIES };
