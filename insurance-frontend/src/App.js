// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ReactFlowProvider } from 'reactflow'; // ✅ 1. IMPORT THIS
import './App.css';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkflowList from './components/WorkflowList';
import WorkflowEditor from './components/WorkflowEditor';
import WorkflowDesigner from './components/WorkflowDesigner';

import AdjusterDashboard from "./components/AdjusterDashboard";
import DocumentProcessor from "./components/DocumentProcessor";
import HighRiskAlerts from "./components/HighRiskAlerts";
import WorkflowMetricsDashboard from "./components/WorkflowMetricsDashboard";
import OverdueTasksReport from "./components/OverdueTasksReport";


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const getUser = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
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

  // Simple AppShell for consistent layout (optional)
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
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* ✅ 2. FIX LOGIN: Change 'setToken' to 'onLoginSuccess' */}
          <Route path="/login" element={!user ? <LoginPage onLoginSuccess={setToken} /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <RegistrationPage /> : <Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={user ? (
              <AppShell>
                {user.isAdmin ? <AdminDashboard /> : <Dashboard />}
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )}
          />

          <Route
            path="/admin/workflows"
            element={user && user.isAdmin ? (
              <AppShell>
                <WorkflowList />
              </AppShell>
            ) : (
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            )}
          />

          <Route
            path="/admin/workflow-editor/:workflowId"
            element={user && user.isAdmin ? (
              <AppShell>
                <WorkflowEditor />
              </AppShell>
            ) : (
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            )
            }
          />

          <Route
            path="/admin/workflow-designer/:workflowId"
            element={user && user.isAdmin ? (
              <AppShell>
                {/* ✅ 3. FIX DESIGNER: Add the provider wrapper */}
                <ReactFlowProvider>
                  <WorkflowDesigner />
                </ReactFlowProvider>
              </AppShell>
            ) : (
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            )}
          />

          <Route path="/adjuster" element={<AdjusterDashboard />} />
          <Route path="/documents" element={<DocumentProcessor />} />
          <Route path="/alerts" element={<HighRiskAlerts />} />
          <Route path="/metrics" element={<WorkflowMetricsDashboard />} />
          <Route path="/overdue" element={<OverdueTasksReport />} />


          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;