// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill ReadableStream for Firebase compatibility
if (typeof global.ReadableStream === 'undefined') {
    global.ReadableStream = require('web-streams-polyfill/ponyfill').ReadableStream;
  }


// Mock Firebase App initialization and services
jest.mock('firebase/app', () => {
    return {
      initializeApp: jest.fn(),
    };
  });
  
jest.mock('firebase/auth', () => {
    return {
      getAuth: jest.fn(() => ({ currentUser: null })),
      signInWithEmailAndPassword: jest.fn(),
    };
  });
  
jest.mock('firebase/firestore', () => {
    return {
      getFirestore: jest.fn(),
    };
  });
  
jest.mock('firebase/database', () => {
    return {
      getDatabase: jest.fn(),
    };
  });
  
jest.mock('firebase/storage', () => {
    return {
      getStorage: jest.fn(),
    };
});