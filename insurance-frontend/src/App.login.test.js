import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Keep same mock style
jest.mock('./components/AdminDashboard', () => () => <div>Admin Dashboard</div>);
jest.mock('./components/Dashboard', () => () => <div>User Dashboard</div>);
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ isAdmin: false, exp: Math.floor(Date.now() / 1000) + 3600 })),
}));

describe('App login flow', () => {
  const origFetch = global.fetch;
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ token: 'token-app' }) });
    const { jwtDecode } = require('jwt-decode');
    jwtDecode.mockImplementation(() => ({ isAdmin: false, exp: Math.floor(Date.now() / 1000) + 3600 }));
  });
  afterEach(() => {
    global.fetch = origFetch;
    jest.clearAllMocks();
  });

  test('successful login updates token and shows dashboard', async () => {
    render(<App />);

    // Fill form from LoginPage rendered by App
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('token-app');
      expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
    });
  });
});
