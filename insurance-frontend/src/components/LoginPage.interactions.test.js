import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

describe('LoginPage interactions', () => {
  const origFetch = global.fetch;
  afterEach(() => {
    global.fetch = origFetch;
    jest.clearAllMocks();
  });

  test('toggles admin login and shows error on bad credentials', async () => {
    const onLoginSuccess = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    render(
      <BrowserRouter>
        <LoginPage onLoginSuccess={onLoginSuccess} />
      </BrowserRouter>
    );

    // Toggle admin
    fireEvent.click(screen.getByLabelText(/Login as Admin/i));

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  test('calls onLoginSuccess on successful login', async () => {
    const onLoginSuccess = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'token123' }),
    });

    render(
      <BrowserRouter>
        <LoginPage onLoginSuccess={onLoginSuccess} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith('token123');
    });
    // Token stored
    expect(localStorage.getItem('token')).toBe('token123');
  });
});
