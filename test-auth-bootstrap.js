import { configureStore } from '@reduxjs/toolkit';
import authReducer, { fetchAuthSession } from './src/redux/slices/authSlice.js';
import { axiosInstance } from './src/api/axiosConfig.js';
import assert from 'assert';

// Mock window object for location
global.window = {
  location: {
    pathname: '/'
  }
};

// Mock Axios responses
const mockAxiosGet = async (url) => {
  if (url === '/auth/user/me' && global.mockScenario === 'valid_user') {
    return { data: { success: true, userData: { _id: 'u1', username: 'user' }, role: 'user' } };
  }
  if (url === '/auth/admin/me' && global.mockScenario === 'valid_admin') {
    return { data: { success: true, userData: { _id: 'a1', username: 'admin' }, role: 'admin' } };
  }
  if (global.mockScenario === 'guest') {
    const error = new Error('No token');
    error.response = { status: 403, data: { message: 'No token provided' } };
    throw error;
  }
  if (global.mockScenario === 'server_error') {
    const error = new Error('Internal Server Error');
    error.response = { status: 500 };
    throw error;
  }
};

axiosInstance.get = mockAxiosGet;

const runTests = async () => {
  console.log('--- Running Redux Auth Bootstrap Tests ---');

  // Test 1: Authenticated User
  console.log('Test 1: Authenticated User');
  global.mockScenario = 'valid_user';
  global.window.location.pathname = '/shop';
  let store = configureStore({ reducer: { auth: authReducer } });
  await store.dispatch(fetchAuthSession());
  let state = store.getState().auth;
  assert.strictEqual(state.isAuthenticated, true);
  assert.strictEqual(state.isInitialized, true);
  assert.strictEqual(state.role, 'user');
  assert.strictEqual(state.user._id, 'u1');
  assert.strictEqual(state.status, 'succeeded');
  assert.ok(!state.access_token && !state.refresh_token, 'Tokens must not be in Redux');
  console.log('✅ Passed: Authenticated User');

  // Test 2: Authenticated Admin
  console.log('Test 2: Authenticated Admin');
  global.mockScenario = 'valid_admin';
  global.window.location.pathname = '/admin/dashboard';
  store = configureStore({ reducer: { auth: authReducer } });
  await store.dispatch(fetchAuthSession());
  state = store.getState().auth;
  assert.strictEqual(state.isAuthenticated, true);
  assert.strictEqual(state.isInitialized, true);
  assert.strictEqual(state.role, 'admin');
  assert.strictEqual(state.user._id, 'a1');
  assert.strictEqual(state.status, 'succeeded');
  console.log('✅ Passed: Authenticated Admin');

  // Test 3: Guest / Expected 403 Unauthenticated
  console.log('Test 3: Guest (Expected 403)');
  global.mockScenario = 'guest';
  global.window.location.pathname = '/';
  store = configureStore({ reducer: { auth: authReducer } });
  await store.dispatch(fetchAuthSession());
  state = store.getState().auth;
  assert.strictEqual(state.isAuthenticated, false);
  assert.strictEqual(state.isInitialized, true);
  assert.strictEqual(state.role, null);
  assert.strictEqual(state.user, null);
  assert.strictEqual(state.status, 'failed');
  assert.strictEqual(state.error, 'unauthenticated');
  console.log('✅ Passed: Guest Bootstrap');

  // Test 4: Unexpected Backend Failure (500)
  console.log('Test 4: Backend Failure (500)');
  global.mockScenario = 'server_error';
  store = configureStore({ reducer: { auth: authReducer } });
  await store.dispatch(fetchAuthSession());
  state = store.getState().auth;
  assert.strictEqual(state.isAuthenticated, false);
  assert.strictEqual(state.isInitialized, true); // Should recover from hanging
  assert.notStrictEqual(state.error, 'unauthenticated');
  console.log('✅ Passed: Backend Failure');

  console.log('All tests passed successfully!');
};

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
