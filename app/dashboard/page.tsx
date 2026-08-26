import { withLayout } from '../../hoc/withLayout';

/**
 * Dashboard Component
 * 
 * This is a protected route (configured in middleware.ts) that demonstrates 
 * the use of our Higher Order Component (HOC) for providing a specific layout.
 * We are using a standard React component (Server or Client) and wrapping it.
 */
function DashboardPage() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to your Dashboard</h2>

      <p className="text-gray-600 mb-6">
        This route is protected by our middleware. If you access it directly without an auth token,
        you should be redirected to the login page (or whatever is configured in middleware.ts).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-800">Total Users</h3>
          <p className="text-2xl font-bold text-blue-900 mt-2">1,204</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <h3 className="font-semibold text-green-800">Revenue</h3>
          <p className="text-2xl font-bold text-green-900 mt-2">$34,500</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <h3 className="font-semibold text-purple-800">Active Sessions</h3>
          <p className="text-2xl font-bold text-purple-900 mt-2">42</p>
        </div>
      </div>
    </div>
  );
}

// Wrap the Dashboard component with our Layout HOC before exporting it.
// We pass a custom title layout prop to configure the header dynamically.
export default withLayout(DashboardPage, { title: 'Dashboard Area' });
