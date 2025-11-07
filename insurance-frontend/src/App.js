import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure you have installed this: npm install jwt-decode
import './App.css'; // Your CSS file
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkflowList from './components/WorkflowList'; // Import WorkflowList
import WorkflowEditor from './components/WorkflowEditor'; // Import WorkflowEditor

import AdjusterDashboard from "./components/AdjusterDashboard";
import DocumentProcessor from "./components/DocumentProcessor";
import HighRiskAlerts from "./components/HighRiskAlerts";
import WorkflowMetricsDashboard from "./components/WorkflowMetricsDashboard";
import OverdueTasksReport from "./components/OverdueTasksReport";


function App() {
  // Use state to manage token, allows App to re-render on login/logout
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Helper function to decode token safely
  const getUser = () => {
    if (!token) return null;
    try {
      // Check token expiry if needed before decoding
      const decoded = jwtDecode(token);
      // Optional: Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired, logging out.");
          localStorage.removeItem('token');
          // Update state directly only if component is mounted, otherwise schedule update
          // For simplicity here, we rely on subsequent render triggered by state change or navigation
          setToken(null);
          return null;
      }
      return decoded;
    } catch (e) {
      console.error("Error decoding token:", e);
      localStorage.removeItem('token'); // Clean up invalid token
      setToken(null); // Update state to trigger re-render
      return null;
    }
  };

  const user = getUser(); // Get user info based on current token state

  // Function passed to LoginPage to update token state
  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken); // Update state to trigger re-render
    // Navigation is handled by the Routes automatically redirecting
  };

  // Function to clear token state and local storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); // Update state to trigger re-render
    // Navigation is handled by the Routes re-evaluating below
  };

  // --- Reusable Layout Component with Navbar for Logged-In Users ---
  const AppShell = ({ children }) => {
    // Use the handleLogout from the App component scope
    const handleLogoutAndRedirect = () => {
      handleLogout();
      // No explicit navigation needed here after logout, Routes below will redirect
    };

    return (
      <>
        <nav className="main-nav">
          <h1>Insurance Portal {user && user.isAdmin ? '- ADMIN' : ''}</h1>
          {user && ( // Only show logout if user exists (implies logged in)
            <button onClick={handleLogoutAndRedirect} className="logout-button">
              Logout
            </button>
          )}
        </nav>
        {/* Render the specific page content passed as children */}
        {/* The .content centering styles are applied here */}
        <div className="content">{children}</div>
      </>
    );
  };

  // --- Main Routing Logic ---
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes: Login and Registration */}
          <Route
            path="/login"
            element={!user ? ( // If user is NOT logged in, show login page
              // Wrap public pages in a basic content div for centering
               <div className="content">
                 <LoginPage onLoginSuccess={handleLogin} />
               </div>
              ) : ( // If user IS logged in, redirect to their dashboard
                <Navigate to="/dashboard" replace /> // Use replace to avoid back button issues
              )
            }
          />
          <Route
            path="/register"
            element={!user ? (
               <div className="content">
                 <RegistrationPage />
               </div>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected Routes: Require Login */}
          {/* Note: /dashboard is now the base for all logged-in views via AppShell */}
          <Route
            path="/dashboard"
            element={user ? ( // If user IS logged in...
              <AppShell>
                {/* Show correct dashboard based on isAdmin flag */}
                {user.isAdmin ? <AdminDashboard /> : <Dashboard />}
              </AppShell>
              ) : ( // If user is NOT logged in, redirect to login
                <Navigate to="/login" replace />
              )
            }
          />
           <Route
            path="/admin/workflows"
            element={user && user.isAdmin ? ( // If user IS logged in AND is admin...
              <AppShell>
                <WorkflowList />
              </AppShell>
              ) : ( // If not logged in or not admin, redirect appropriately
                <Navigate to={user ? "/dashboard" : "/login"} replace /> // Send non-admins to their dash, logged out to login
              )
            }
          />
           <Route
            path="/admin/workflows/:workflowId" // Handles "/admin/workflows/new" and "/admin/workflows/SOME_ID"
            element={user && user.isAdmin ? (
              <AppShell>
                <WorkflowEditor />
              </AppShell>
              ) : ( // If not logged in or not admin, redirect appropriately
                <Navigate to={user ? "/dashboard" : "/login"} replace /> // Send non-admins to their dash, logged out to login
              )
            }
          />


           <Route path="/adjuster" element={<AdjusterDashboard />} />
           <Route path="/documents" element={<DocumentProcessor />} />
           <Route path="/alerts" element={<HighRiskAlerts />} />
           <Route path="/metrics" element={<WorkflowMetricsDashboard />} />
           <Route path="/overdue" element={<OverdueTasksReport />} />

           
          {/* Fallback Route: Redirects any unknown path */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} // Redirect based on login status
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;