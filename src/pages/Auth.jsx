import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import './Auth.css';

export function Login() {
  const { login } = useExpenses();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setTimeout(() => {
      const saved = localStorage.getItem('et_registered_user');
      if (saved) {
        const user = JSON.parse(saved);
        if (user.email === form.email && user.password === form.password) {
          login({ name: user.name, email: user.email });
          navigate('/');
          return;
        }
      }
      // Demo login
      if (form.email === 'demo@spendtrack.ng' && form.password === 'demo1234') {
        login({ name: 'Demo User', email: form.email });
        navigate('/');
        return;
      }
      setError('Invalid email or password');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon-lg">₦</div>
          <div className="auth-brand-name">SpendTrack</div>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-demo">
          <div className="demo-hint">Demo credentials:</div>
          <div className="demo-creds">demo@spendtrack.ng / demo1234</div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent2)' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { login } = useExpenses();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('et_registered_user', JSON.stringify({ name: form.name, email: form.email, password: form.password }));
      login({ name: form.name, email: form.email });
      navigate('/');
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon-lg">₦</div>
          <div className="auth-brand-name">SpendTrack</div>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Start tracking your expenses today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className={`form-control ${errors.name ? 'error' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className={`form-control ${errors.email ? 'error' : ''}`} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className={`form-control ${errors.password ? 'error' : ''}`} name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input className={`form-control ${errors.confirm ? 'error' : ''}`} name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Re-enter password" />
            {errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" style={{ color: 'var(--accent2)' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
