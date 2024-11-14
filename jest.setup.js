// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Add TextEncoder and TextDecoder for MongoDB tests
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock MongoDB connection
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

// Mock mongoose for testing
jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return {
    ...mongoose,
    connect: jest.fn().mockResolvedValue(mongoose),
    connection: {
      ...mongoose.connection,
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn().mockResolvedValue(true),
    },
  };
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
});
