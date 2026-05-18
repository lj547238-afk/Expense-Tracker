import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import './Settings.css';

export function Settings() {
  const { budget, setBudget, income, setIncome, expenses, clearExpenses } = useExpenses();
  const [budgetInput, setBudgetInput] = useState(budget);
  const [incomeInput, setIncomeInput] = useState(income);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!isNaN(budgetInput) && budgetInput > 0) setBudget(Number(budgetInput));
    if (!isNaN(incomeInput) && incomeInput > 0) setIncome(Number(incomeInput));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    const confirmed = window.confirm('Are you sure? This will permanently delete all your expenses!');
    if (confirmed) {
      clearExpenses();
    }
  };

  const totalSize = JSON.stringify(expenses).length;

  return (
    <div className="page-container animate-in">
      <h1 className="section-title">Settings</h1>
      <p className="section-sub">Configure your financial preferences</p>

      <div className="settings-layout">
        <div>
          <div className="card settings-card">
            <h3 className="settings-section-title">💰 Financial Settings</h3>

            <div className="form-group">
              <label>Monthly Income (₦)</label>
              <input
                className="form-control"
                type="number"
                value={incomeInput}
                onChange={e => setIncomeInput(e.target.value)}
                placeholder="e.g. 250000"
                min="0"
              />
              <div className="form-hint">Your total monthly income or salary</div>
            </div>

            <div className="form-group">
              <label>Monthly Budget (₦)</label>
              <input
                className="form-control"
                type="number"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                placeholder="e.g. 150000"
                min="0"
              />
              <div className="form-hint">The maximum you want to spend per month</div>
            </div>

            {saved && (
              <div className="success-msg">✅ Settings saved successfully!</div>
            )}

            <button className="btn btn-primary mt-4" onClick={handleSave}>Save Settings</button>
          </div>

          <div className="card settings-card mt-4">
            <h3 className="settings-section-title">📱 App Information</h3>
            <div className="info-rows">
              <div className="info-row">
                <span>App Name</span>
                <span>SpendTrack</span>
              </div>
              <div className="info-row">
                <span>Version</span>
                <span>1.0.0</span>
              </div>
              <div className="info-row">
                <span>Total Expenses</span>
                <span>{expenses.length}</span>
              </div>
              <div className="info-row">
                <span>Storage Used</span>
                <span>{(totalSize / 1024).toFixed(1)} KB</span>
              </div>
              <div className="info-row">
                <span>Currency</span>
                <span>Nigerian Naira (₦)</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card settings-card">
            <h3 className="settings-section-title">🗄️ Data Management</h3>
            <p className="text-muted text-sm mb-4" style={{ lineHeight: 1.6 }}>
              Your data is stored locally in your browser's localStorage. It persists across sessions on this device.
            </p>

            <div className="data-actions">
              <div className="data-action-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Export Data</div>
                  <div className="text-muted text-sm">Download your expenses as JSON</div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => {
                  const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'spendtrack-expenses.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}>Export</button>
              </div>

              <div className="data-action-item danger-action">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--red)' }}>Clear All Expenses</div>
                  <div className="text-muted text-sm">Permanently delete all expense records</div>
                </div>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: 13, padding: '8px 16px' }}
                  onClick={handleClearData}
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>

          <div className="card settings-card mt-4">
            <h3 className="settings-section-title">📋 About This Project</h3>
            <div className="about-text">
              <p>Built with <strong>React.js</strong> as part of a Computer Science 200-level group project (Group N).</p>
              <div className="tech-stack">
                {['React 18', 'React Router v6', 'Recharts', 'localStorage', 'CSS3'].map(t => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Profile() {
  const { user, login } = useExpenses();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    login({ ...user, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-container animate-in">
      <h1 className="section-title">Profile</h1>
      <p className="section-sub">Manage your account information</p>

      <div className="settings-layout">
        <div className="card settings-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">{form.name?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, fontFamily: 'Syne, sans-serif' }}>{form.name || 'User'}</div>
              <div className="text-muted text-sm">{form.email}</div>
            </div>
          </div>

          <div className="divider" />

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
            </div>
            {saved && <div className="success-msg">✅ Profile updated!</div>}
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}
