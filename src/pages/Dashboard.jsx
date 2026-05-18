import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import './Dashboard.css';

function StatCard({ label, amount, icon, color, sub }) {
  return (
    <div className="stat-card" style={{ '--accent-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-amount">₦{amount.toLocaleString()}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function SetupModal({ onClose }) {
  const { setBudget, setIncome } = useExpenses();
  const [form, setForm] = useState({ income: '', budget: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.income || isNaN(form.income) || Number(form.income) <= 0) errs.income = 'Enter a valid income';
    if (!form.budget || isNaN(form.budget) || Number(form.budget) <= 0) errs.budget = 'Enter a valid budget';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIncome(Number(form.income));
    setBudget(Number(form.budget));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon"></div>
          <h2 className="modal-title">Set Up Your Finances</h2>
          <p className="modal-sub">Enter your monthly income and budget to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Monthly Income (₦)</label>
            <input
              className={`form-control ${errors.income ? 'error' : ''}`}
              type="number"
              placeholder="e.g. 250000"
              value={form.income}
              onChange={e => { setForm(f => ({ ...f, income: e.target.value })); setErrors(err => ({ ...err, income: '' })); }}
            />
            {errors.income && <div className="form-error">{errors.income}</div>}
          </div>

          <div className="form-group">
            <label>Monthly Budget (₦)</label>
            <input
              className={`form-control ${errors.budget ? 'error' : ''}`}
              type="number"
              placeholder="e.g. 150000"
              value={form.budget}
              onChange={e => { setForm(f => ({ ...f, budget: e.target.value })); setErrors(err => ({ ...err, budget: '' })); }}
            />
            {errors.budget && <div className="form-error">{errors.budget}</div>}
            <div className="form-hint">The maximum you want to spend this month</div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Skip for now</button>
            <button type="submit" className="btn btn-primary">Save & Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { expenses, income, budget, totalExpenses, balance, categories } = useExpenses();
  const [showSetup, setShowSetup] = useState(false);

  const recentExpenses = expenses.slice(0, 6);
  const budgetUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;
  const isNewUser = income === 0 && budget === 0;

  const categoryTotals = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => {
        const cat = categories.find(c => c.name === name);
        return { name, value, color: cat?.color || '#6b7280', icon: cat?.icon || '' };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [expenses, categories]);

  const today = new Date();
  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="page-container animate-in">
      {showSetup && <SetupModal onClose={() => setShowSetup(false)} />}

      <div className="dashboard-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-sub">Your financial overview at a glance</p>
        </div>
        <div className="header-actions">
          {isNewUser && (
            <button className="btn btn-setup" onClick={() => setShowSetup(true)}>
              ⚙️ Set Up Budget & Income
            </button>
          )}
          {!isNewUser && (
            <button className="btn btn-ghost" onClick={() => setShowSetup(true)}>
              ✏️ Edit Budget
            </button>
          )}
          <Link to="/add" className="btn btn-primary">
            <span style={{ fontSize: 18 }}>+</span> Add Expense
          </Link>
        </div>
      </div>

      {/* New user banner */}
      {isNewUser && (
        <div className="setup-banner">
          <div className="setup-banner-left">
            <span className="setup-banner-icon">👋</span>
            <div>
              <div className="setup-banner-title">Welcome! Let's get you set up</div>
              <div className="setup-banner-sub">Add your monthly income and budget so we can track your spending properly.</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowSetup(true)}>
            Get Started
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard label="Monthly Income" amount={income} icon="" color="var(--green)" sub="Total income" />
        <StatCard label="Total Expenses" amount={totalExpenses} icon="" color="var(--red)" sub="All time" />
        <StatCard label="This Month" amount={monthTotal} icon="" color="var(--orange)" sub={`${monthExpenses.length} transactions`} />
        <StatCard label="Balance" amount={Math.abs(balance)} icon={balance >= 0 ? '✅' : '⚠️'} color={balance >= 0 ? 'var(--green)' : 'var(--red)'} sub={balance >= 0 ? 'Available' : 'Overspent'} />
      </div>

      {/* Budget Progress */}
      <div className="card budget-card mb-6">
        <div className="flex-between mb-4">
          <div>
            <div className="font-bold" style={{ fontSize: 16 }}>Monthly Budget</div>
            {budget > 0 ? (
              <div className="text-muted text-sm">₦{totalExpenses.toLocaleString()} of ₦{budget.toLocaleString()} used</div>
            ) : (
              <div className="text-muted text-sm">No budget set — <button className="inline-link" onClick={() => setShowSetup(true)}>set one now</button></div>
            )}
          </div>
          <div className={`budget-pct ${budgetUsed > 90 ? 'danger' : budgetUsed > 70 ? 'warn' : 'ok'}`}>
            {budget > 0 ? `${budgetUsed.toFixed(0)}%` : '—'}
          </div>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${budgetUsed > 90 ? 'danger' : budgetUsed > 70 ? 'warn' : ''}`}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
        </div>
        <div className="flex-between mt-2">
          <span className="text-xs text-muted">0%</span>
          <span className="text-xs text-muted">100%</span>
        </div>
      </div>

      <div className="dashboard-bottom">
        {/* Recent Expenses */}
        <div className="card recent-card">
          <div className="flex-between mb-4">
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Expenses</h2>
            <Link to="/history" className="text-sm" style={{ color: 'var(--accent2)' }}>View all →</Link>
          </div>
          <div className="recent-list">
            {recentExpenses.length === 0 ? (
              <div className="empty-state">
                <div className="icon"></div>
                <h3>No expenses yet</h3>
                <p>Add your first expense to get started</p>
                <Link to="/add" className="btn btn-primary mt-4" style={{ display: 'inline-flex' }}>+ Add Expense</Link>
              </div>
            ) : (
              recentExpenses.map(exp => {
                const cat = categories.find(c => c.name === exp.category);
                return (
                  <div key={exp.id} className="expense-row">
                    <div className="expense-icon-wrap" style={{ background: (cat?.color || '#6b7280') + '22' }}>
                      <span>{cat?.icon || ''}</span>
                    </div>
                    <div className="expense-info">
                      <div className="expense-title">{exp.title}</div>
                      <div className="expense-meta">{exp.category} · {new Date(exp.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>
                    </div>
                    <div className="expense-amount">-₦{exp.amount.toLocaleString()}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Pie */}
        <div className="card chart-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Spending by Category</h2>
          {categoryTotals.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryTotals} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {categoryTotals.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {categoryTotals.map((cat, i) => (
                  <div key={i} className="legend-row">
                    <div className="flex gap-2" style={{ alignItems: 'center' }}>
                      <div className="legend-dot" style={{ background: cat.color }} />
                      <span className="text-sm">{cat.icon} {cat.name}</span>
                    </div>
                    <span className="text-sm font-bold">₦{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon"></div>
              <p>No data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}