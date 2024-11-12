// SignIn.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignIn from '../pages/SignInSection/SignIn';
import { useUser } from '../UserContext';
import { auth } from '../_utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Mock Firebase authentication functions
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({ currentUser: null })), // Mock getAuth
    signInWithEmailAndPassword: jest.fn(), // Mock signInWithEmailAndPassword
  }));
  
jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('SignIn Component', () => {
  let setUserIdMock;
  let navigateMock;

  beforeEach(() => {
    setUserIdMock = jest.fn();
    useUser.mockReturnValue({ setUserId: setUserIdMock });
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    jest.clearAllMocks();
  });

  it('renders all form elements correctly', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('updates email and password state on user input', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows error message for empty email and password on submit', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/please enter a valid email and password/i)).toBeInTheDocument();
  });

  it('calls signInWithEmailAndPassword with valid credentials', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { emailVerified: true },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'user@example.com',
        'password123'
      );
    });
  });

  it('navigates to VerifyEmail if email is not verified', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { emailVerified: false },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/VerifyEmail');
    });
  });

  it('displays error message for invalid credentials', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid Credentials'));

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('navigates to ForgotPassword when "Forgot Password?" is clicked', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.click(screen.getByText(/forgot password/i));
    expect(navigateMock).toHaveBeenCalledWith('/ForgotPassword');
  });

  it('navigates to Profile page if user is active and role is regular user', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { emailVerified: true },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ userID: '123', role: '1', status: '1' }),
      })
    );

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/Profile');
    });
  });

  it('displays blocked message if user is blocked', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { emailVerified: true },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ userID: '123', role: '1', status: '0' }),
      })
    );

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/your account is currently blocked/i)).toBeInTheDocument();
    });
  });
});
