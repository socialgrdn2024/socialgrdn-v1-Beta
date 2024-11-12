// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useUserAuth } from './_utils/auth-context';

jest.mock('./_utils/auth-context', () => ({
  useUserAuth: jest.fn(),
}));

describe('App Component', () => {
  it('renders landing page for unauthenticated users', () => {
    useUserAuth.mockReturnValue({ currentUser: null }); // Mock no user logged in
    render(<App />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('renders search page for authenticated users', () => {
    useUserAuth.mockReturnValue({ currentUser: { uid: '123' } }); // Mock user logged in
    render(<App />);
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });
});
