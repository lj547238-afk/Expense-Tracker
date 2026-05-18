import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import './History.css';

export default function History() {
  const { expenses, deleteExpense, editExpense, categories } = useExpenses();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (search) list = list.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
    if (filterCat) list = list.filter(e => e.category === filterCat);
    switch (sortBy) {
      case 'date-asc': list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount-desc': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount-asc': list.sort((a, b) => a.amount - b.amount); break;
      default: list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return list;
  }, [expenses, search, filterCat, sortBy]);

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const startEdit = (exp) => {
    setEditId(exp.id);
    setEditForm({ title: exp.title, amount: exp.amount, category: exp.category, date: exp.date, note: exp.note || '' });
  };

  const saveEdit = () => {
    editExpense(editId, { ...editForm, amount: Number(editForm.amount) });
    setEditId(null);
  };

  const handleDelete = (id) => {
    deleteExpense(id);
    setConfirmDelete(null);
  };

  return (
    <div className="page-container animate-in">
      <div className="history-header">
        <div>
          <h1 className="section-title">Expense History</h1>
          <p className="section-sub">{filtered.length} transactions · Total: ₦{totalFiltered.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar card">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search expenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="clear-btn" onClick={() => setSearch('')}>✕</button>}
        </div>

        <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
        </select>

        <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date-desc">Latest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* List */}
      <div className="history-list">
        {filtered.length === 0 ? (
          <div className="empty-state card">
            <div className="icon">🔍</div>
            <h3>No expenses found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map(exp => {
            const cat = categories.find(c => c.name === exp.category);
            const isEditing = editId === exp.id;
            return (
              <div key={exp.id} className={`history-item card ${isEditing ? 'editing' : ''}`}>
                {isEditing ? (
                  <div className="edit-form">
                    <div className="grid-2">
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label>Title</label>
                        <input className="form-control" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label>Amount (₦)</label>
                        <input className="form-control" type="number" value={editForm.amount} onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label>Category</label>
                        <select className="form-control" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                          {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label>Date</label>
                        <input className="form-control" type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button className="btn btn-ghost" onClick={() => setEditId(null)}>Cancel</button>
                      <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="history-row">
                    <div className="history-icon" style={{ background: (cat?.color || '#6b7280') + '22' }}>
                      {cat?.icon || '📦'}
                    </div>
                    <div className="history-info">
                      <div className="history-title">{exp.title}</div>
                      <div className="history-meta">
                        <span className="tag">{exp.category}</span>
                        <span className="text-muted text-sm">{new Date(exp.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {exp.note && <span className="text-muted text-sm">· {exp.note}</span>}
                      </div>
                    </div>
                    <div className="history-amount">-₦{exp.amount.toLocaleString()}</div>
                    <div className="history-actions">
                      <button className="icon-btn edit-btn" onClick={() => startEdit(exp)} title="Edit">✏️</button>
                      <button className="icon-btn del-btn" onClick={() => setConfirmDelete(exp.id)} title="Delete">🗑️</button>
                    </div>
                  </div>
                )}

                {confirmDelete === exp.id && (
                  <div className="confirm-delete">
                    <span>Delete this expense?</span>
                    <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => handleDelete(exp.id)}>Yes, Delete</button>
                    <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => setConfirmDelete(null)}>Cancel</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
