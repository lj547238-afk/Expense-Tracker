import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import './Charts.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="tooltip-value" style={{ color: p.color }}>
            ₦{Number(p.value).toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Charts() {
  const { expenses, categories, income } = useExpenses();
  const [activeTab, setActiveTab] = useState('category');

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { name: name.split(' ')[0], fullName: name, value, color: cat?.color || '#6b7280', icon: cat?.icon || '' };
    }).sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  const monthlyData = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) map[key] = { month: MONTHS[d.getMonth()], year: d.getFullYear(), total: 0, month_idx: d.getMonth() };
      map[key].total += e.amount;
    });
    return Object.values(map)
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month_idx - b.month_idx)
      .slice(-6)
      .map(m => ({ ...m, income, savings: Math.max(0, income - m.total) }));
  }, [expenses, income]);

  const dailyData = useMemo(() => {
    const map = {};
    const now = new Date();
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).forEach(e => {
      const day = new Date(e.date).getDate();
      map[day] = (map[day] || 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0])).map(([day, amount]) => ({ day: `Day ${day}`, amount }));
  }, [expenses]);

  const tabs = [
    { id: 'category', label: 'By Category' },
    { id: 'monthly', label: 'Monthly Trend' },
    { id: 'daily', label: 'Daily (This Month)' },
    { id: 'pie', label: 'Pie Chart' },
  ];

  return (
    <div className="page-container animate-in">
      <h1 className="section-title">Charts & Analytics</h1>
      <p className="section-sub">Visual breakdown of your spending patterns</p>

      <div className="chart-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`chart-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="chart-area card">
        {activeTab === 'category' && (
          <div>
            <h3 className="chart-title">Spending by Category</h3>
            {categoryData.length === 0 ? <div className="empty-state"><div className="icon"> </div><p>No data yet</p></div> : (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {activeTab === 'monthly' && (
          <div>
            <h3 className="chart-title">Monthly Expenses vs Income</h3>
            {monthlyData.length === 0 ? <div className="empty-state"><div className="icon"> </div><p>No data yet</p></div> : (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text2)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: 'var(--text2)', fontSize: 13 }} />
                  <Bar dataKey="total" name="Expenses" fill="var(--red)" radius={[6,6,0,0]} opacity={0.85} />
                  <Bar dataKey="income" name="Income" fill="var(--green)" radius={[6,6,0,0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {activeTab === 'daily' && (
          <div>
            <h3 className="chart-title">Daily Spending — This Month</h3>
            {dailyData.length === 0 ? <div className="empty-state"><div className="icon">📅</div><p>No expenses this month</p></div> : (
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={dailyData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {activeTab === 'pie' && (
          <div>
            <h3 className="chart-title">Expense Distribution</h3>
            {categoryData.length === 0 ? <div className="empty-state"><div className="icon"> </div><p>No data yet</p></div> : (
              <div className="pie-layout">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={130} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={v => `₦${v.toLocaleString()}`} contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend-full">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="pie-legend-item">
                      <div className="flex gap-2" style={{ alignItems: 'center' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13 }}>{cat.icon} {cat.fullName}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Syne, sans-serif' }}>₦{cat.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
