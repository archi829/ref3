// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <-- 1. REMOVED BrowserRouter
import './App.css';
import { jwtDecode as decode } from 'jwt-decode'; // Use named import

// Import all components
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdjusterDashboard from './components/AdjusterDashboard';
import FileClaim from './components/FileClaim';
import WorkflowList from './components/WorkflowList';
import WorkflowEditor from './components/WorkflowEditor';
import WorkflowDesigner from './components/WorkflowDesigner'; // Your new component

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const getUser = () => {
    const token = localStorage.getItem('token');
    if (!token) { // <-- 2. ADDED THIS FIX
      return null;
    }
    try {
      const decoded = decode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setToken(null);
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token');
      setToken(null);
      return null;
    }
  };

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Simple AppShell for consistent layout
  const AppShell = ({ children }) => (
    <div className="app-shell">
      <nav className="main-nav">
        <h1>InsuranceSys</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );

  return (
    // <BrowserRouter> {/* <-- 3. REMOVED THIS WRAPPER */}
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage setToken={setToken} />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/" element={<Navigate replace to="/login" />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <AppShell><Dashboard user={user} /></AppShell> : <Navigate replace to="/login" />} />
          <Route path="/file-claim" element={user ? <AppShell><FileClaim /></AppShell> : <Navigate replace to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={user && user.isAdmin ? <AppShell><AdminDashboard /></AppShell> : <Navigate replace to="/login" />} />
          <Route path="/admin/workflows" element={user && user.isAdmin ? <AppShell><WorkflowList /></AppShell> : <Navigate replace to="/login" />} />
          <Route path="/admin/workflow-editor/:workflowId" element={user && user.isAdmin ? <AppShell><WorkflowEditor /></AppShell> : <Navigate replace to="/login" />} />
          <Route path="/admin/workflow-designer/:workflowId" element={user && user.isAdmin ? <AppShell><WorkflowDesigner /></AppShell> : <Navigate replace to="/login" />} />

          {/* Adjuster Routes */}
          <Route path="/adjuster-dashboard" element={user && (user.isAdmin || user.role === 'Adjuster') ? <AppShell><AdjusterDashboard /></AppShell> : <Navigate replace to="/login" />} />
        </Routes>
      </div>
    // </BrowserRouter> {/* <-- 4. REMOVED THIS WRAPPER */}
  );
}

export default App;