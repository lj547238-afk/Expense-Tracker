import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Charts from './pages/Charts';
import Monthly from './pages/Monthly';
import { Settings, Profile } from './pages/Settings';
import { Login, Register } from './pages/Auth';
import { NotFound, Footer } from './pages/Misc';
import './index.css';

function ProtectedRoute({ children }) {
  const { user } = useExpenses();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const { user } = useExpenses();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {user && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
          <Route path="/monthly" element={<ProtectedRoute><Monthly /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ExpenseProvider>
        <AppLayout />
      </ExpenseProvider>
    </BrowserRouter>
  );
}
