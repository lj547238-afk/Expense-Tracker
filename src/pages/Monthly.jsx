import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import './Monthly.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Monthly() {
  const { expenses, income, budget, categories } = useExpenses();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const years = useMemo(() => {
    const ys = new Set(expenses.map(e => new Date(e.date).getFullYear()));
    ys.add(now.getFullYear());
    return [...ys].sort((a, b) => b - a);
  }, [expenses]);

  const monthExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [expenses, selectedMonth, selectedYear]);

  const total = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const saved = Math.max(0, income - total);
  const budgetLeft = Math.max(0, budget - total);
  const budgetPct = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  const catBreakdown = useMemo(() => {
    const map = {};
    monthExpenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { name: name.split('&')[0].trim(), value, color: cat?.color || '#6b7280', icon: cat?.icon || '📦', pct: total > 0 ? ((value / total) * 100).toFixed(0) : 0 };
    }).sort((a, b) => b.value - a.value);
  }, [monthExpenses, categories, total]);

  const weeklyData = useMemo(() => {
    const weeks = [0, 0, 0, 0, 0];
    monthExpenses.forEach(e => {
      const day = new Date(e.date).getDate();
      const week = Math.min(Math.ceil(day / 7) - 1, 4);
      weeks[week] += e.amount;
    });
    return weeks.map((amt, i) => ({ week: `Week ${i + 1}`, amount: amt }));
  }, [monthExpenses]);

  return (
    <div className="page-container animate-in">
      <div className="monthly-header">
        <div>
          <h1 className="section-title">Monthly Summary</h1>
          <p className="section-sub">Detailed breakdown for the selected month</p>
        </div>
        <div className="month-selector">
          <select className="filter-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="filter-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="monthly-stats">
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(244,63,94,0.15)' }}></div>
          <div className="m-stat-label">Total Spent</div>
          <div className="m-stat-value" style={{ color: 'var(--red)' }}>₦{total.toLocaleString()}</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(16,217,160,0.15)' }}></div>
          <div className="m-stat-label">Income</div>
          <div className="m-stat-value" style={{ color: 'var(--green)' }}>₦{income.toLocaleString()}</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(20,184,166,0.15)' }}></div>
          <div className="m-stat-label">Saved</div>
          <div className="m-stat-value" style={{ color: saved > 0 ? 'var(--green)' : 'var(--red)' }}>₦{saved.toLocaleString()}</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(124,109,242,0.15)' }}></div>
          <div className="m-stat-label">Budget Left</div>
          <div className="m-stat-value" style={{ color: budgetLeft > 0 ? 'var(--accent2)' : 'var(--red)' }}>₦{budgetLeft.toLocaleString()}</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(249,115,22,0.15)' }}></div>
          <div className="m-stat-label">Transactions</div> 
          <div className="m-stat-value" style={{ color: 'var(--orange)' }}>{monthExpenses.length}</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}></div>
          <div className="m-stat-label">Daily Avg</div>
          <div className="m-stat-value" style={{ color: 'var(--blue)' }}>₦{monthExpenses.length > 0 ? Math.round(total / new Date(selectedYear, selectedMonth + 1, 0).getDate()).toLocaleString() : 0}</div>
        </div>
      </div>

      {/* Budget bar */}
      <div className="card mb-6">
        <div className="flex-between mb-4">
          <div>
            <div className="font-bold" style={{ fontSize: 15 }}>Budget Usage — {MONTHS[selectedMonth]}</div>
            <div className="text-muted text-sm">₦{total.toLocaleString()} spent of ₦{budget.toLocaleString()} budget</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: budgetPct > 90 ? 'var(--red)' : budgetPct > 70 ? 'var(--yellow)' : 'var(--green)' }}>
            {budgetPct.toFixed(0)}%
          </div>
        </div>
        <div className="progress-bar" style={{ height: 12 }}>
          <div className="progress-fill" style={{ width: `${budgetPct}%`, background: budgetPct > 90 ? 'linear-gradient(90deg, var(--orange), var(--red))' : budgetPct > 70 ? 'linear-gradient(90deg, var(--yellow), var(--orange))' : undefined }} />
        </div>
      </div>

      <div className="monthly-bottom">
        {/* Category Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Category Breakdown</h3>
          {catBreakdown.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div>
              <p>No expenses in {MONTHS[selectedMonth]}</p>
            </div>
          ) : (
            <div className="cat-breakdown">
              {catBreakdown.map((cat, i) => (
                <div key={i} className="cat-breakdown-row">
                  <div className="flex gap-3" style={{ alignItems: 'center', minWidth: 0 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{cat.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{cat.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{cat.pct}% of total</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', color: cat.color, textAlign: 'right' }}>₦{cat.value.toLocaleString()}</div>
                    <div className="cat-mini-bar">
                      <div className="cat-mini-fill" style={{ width: `${cat.pct}%`, background: cat.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Trend */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Weekly Spending</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'var(--text2)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`₦${Number(v).toLocaleString()}`, 'Spent']} contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
              <Bar dataKey="amount" radius={[8,8,0,0]}>
                {weeklyData.map((_, i) => <Cell key={i} fill={['var(--accent)', 'var(--blue)', 'var(--green)', 'var(--orange)', 'var(--red)'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Transactions */}
          <div className="divider" />
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>All Transactions</h3>
          <div className="monthly-txns">
            {monthExpenses.length === 0 ? (
              <p className="text-muted text-sm">No transactions this month</p>
            ) : (
              monthExpenses.slice(0, 8).map(e => {
                const cat = categories.find(c => c.name === e.category);
                return (
                  <div key={e.id} className="monthly-txn-row">
                    <span>{cat?.icon || '📦'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>{new Date(e.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--red)', fontFamily: 'Syne, sans-serif' }}>₦{e.amount.toLocaleString()}</span>
                  </div>
                );
              })
            )}
            {monthExpenses.length > 8 && <div className="text-muted text-sm mt-2">+{monthExpenses.length - 8} more in History</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
