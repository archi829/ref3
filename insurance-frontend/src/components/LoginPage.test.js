// insurance-frontend/src/components/LoginPage.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

test('renders login form', () => {
  render(
    <BrowserRouter>
      <LoginPage onLoginSuccess={() => {}} />
    </BrowserRouter>
  );

  // Check if the "Customer Login" title is on the page
  expect(screen.getByText(/Customer Login/i)).toBeInTheDocument();
  // Check if the email field is on the page
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  // Check if the password field is on the page
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});
