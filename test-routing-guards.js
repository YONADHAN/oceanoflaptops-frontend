import assert from 'assert';
// Simple mock of the react-router and react-redux hooks to verify the logic

let mockState = {};
const useSelector = (selector) => selector({ auth: mockState });

const PrivateRoute = ({ allowedRole, redirectTo, children }) => {
    const { isAuthenticated, isInitialized, role } = useSelector(state => state.auth);

    if (!isInitialized) return 'LOADING';
    if (!isAuthenticated) return `REDIRECT:${redirectTo}`;
    if (allowedRole !== role) return `REDIRECT:${redirectTo}`;
    return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitialized, role } = useSelector((state) => state.auth);

  if (!isInitialized) return 'LOADING';
  if (isAuthenticated) {
    if (role === "admin") return `REDIRECT:/admin/dashboard`;
    if (role === "user") return `REDIRECT:/`;
  }
  return children;
};

const runTests = () => {
    console.log('--- Testing PrivateRoute ---');
    // 1. isInitialized=false -> loading state
    mockState = { isInitialized: false };
    assert.strictEqual(PrivateRoute({}), 'LOADING');

    // 2. initialized + authenticated user -> allowed
    mockState = { isInitialized: true, isAuthenticated: true, role: 'user' };
    assert.strictEqual(PrivateRoute({ allowedRole: 'user', children: 'OK' }), 'OK');

    // 3. initialized + unauthenticated -> redirect
    mockState = { isInitialized: true, isAuthenticated: false };
    assert.strictEqual(PrivateRoute({ redirectTo: '/login' }), 'REDIRECT:/login');

    // 4. authenticated admin accessing admin route -> allowed
    mockState = { isInitialized: true, isAuthenticated: true, role: 'admin' };
    assert.strictEqual(PrivateRoute({ allowedRole: 'admin', children: 'OK' }), 'OK');

    // 5. authenticated user accessing admin route -> denied
    mockState = { isInitialized: true, isAuthenticated: true, role: 'user' };
    assert.strictEqual(PrivateRoute({ allowedRole: 'admin', redirectTo: '/login' }), 'REDIRECT:/login');

    console.log('--- Testing PublicRoute ---');
    // Guest
    mockState = { isInitialized: true, isAuthenticated: false };
    assert.strictEqual(PublicRoute({ children: 'PUBLIC' }), 'PUBLIC');

    // Authenticated user
    mockState = { isInitialized: true, isAuthenticated: true, role: 'user' };
    assert.strictEqual(PublicRoute({}), 'REDIRECT:/');

    // Authenticated admin
    mockState = { isInitialized: true, isAuthenticated: true, role: 'admin' };
    assert.strictEqual(PublicRoute({}), 'REDIRECT:/admin/dashboard');

    console.log('✅ All routing tests passed!');
};

runTests();
