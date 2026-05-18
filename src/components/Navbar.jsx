import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, balance } = useExpenses();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '⊞' },
    { to: '/add', label: 'Add Expense', icon: '+' },
    { to: '/history', label: 'History', icon: '☰' },
    { to: '/charts', label: 'Charts', icon: '◎' },
    { to: '/monthly', label: 'Monthly', icon: '⊡' },
    { to: '/settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">₦</div>
          <span className="brand-name">SpendTrack</span>
        </NavLink>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-right">
          <div className="balance-pill">
            <span className="balance-label">Balance</span>
            <span className={`balance-amount ${balance >= 0 ? 'pos' : 'neg'}`}>
              ₦{Math.abs(balance).toLocaleString()}
            </span>
          </div>

          {user && (
            <div className="user-menu">
              <div className="avatar" onClick={() => setProfileOpen(open => !open)}>{user.name?.[0]?.toUpperCase() || 'U'}</div>
              <div className={`user-dropdown ${profileOpen ? 'open' : ''}`}>
                <div className="dropdown-name">{user.name}</div>
                <div className="dropdown-email">{user.email}</div>
                <div className="dropdown-divider" />
                <NavLink to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>Profile</NavLink>
                <button className="dropdown-item danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
