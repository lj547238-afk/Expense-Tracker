import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import './AddExpense.css';

export default function AddExpense() {
  const { addExpense, categories } = useExpenses();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], note: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.category) e.category = 'Select a category';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    addExpense({ ...form, amount: Number(form.amount) });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate('/history');
    }, 1500);
  };

  const handleReset = () => {
    setForm({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], note: '' });
    setErrors({});
  };

  return (
    <div className="page-container animate-in">
      <div className="add-header">
        <div>
          <h1 className="section-title">Add Expense</h1>
          <p className="section-sub">Record a new transaction</p>
        </div>
      </div>

      <div className="add-layout">
        <div className="card add-form-card">
          {success && (
            <div className="success-banner">
              ✅ Expense added successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Expense Title</label>
              <input
                className={`form-control ${errors.title ? 'error' : ''}`}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping"
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Amount (₦)</label>
                <input
                  className={`form-control ${errors.amount ? 'error' : ''}`}
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.amount && <div className="form-error">{errors.amount}</div>}
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  className={`form-control ${errors.date ? 'error' : ''}`}
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
                {errors.date && <div className="form-error">{errors.date}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className={`form-control ${errors.category ? 'error' : ''}`}
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label>Note (Optional)</label>
              <textarea
                className="form-control"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Any additional details..."
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset</button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Expense</button>
            </div>
          </form>
        </div>

        {/* Category picker */}
        <div>
          <div className="card cat-picker-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Quick Category</h3>
            <div className="cat-grid">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  className={`cat-btn ${form.category === cat.name ? 'selected' : ''}`}
                  style={{ '--cat-color': cat.color }}
                  onClick={() => { setForm(f => ({ ...f, category: cat.name })); setErrors(e => ({ ...e, category: '' })); }}
                >
                  <span className="cat-emoji">{cat.icon}</span>
                  <span className="cat-name">{cat.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card tip-card mt-4">
            <div className="tip-icon">💡</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Pro Tip</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                Track every expense, no matter how small. Small daily expenses add up quickly and can significantly impact your budget over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
