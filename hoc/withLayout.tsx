import React from 'react';

// Define standard layout props if needed
interface LayoutProps {
  title?: string;
}

/**
 * Higher Order Component (HOC) to wrap a component with a standard layout.
 * Why use HOC here? 
 * While App Router layouts (`layout.tsx`) are the standard way to handle layouts in Next.js 13+,
 * a HOC is useful for specific page-level layout overriding or adding shared UI 
 * (like a specific sidebar or conditional header) across a subset of components dynamically.
 * It provides a programmatic way to attach layouts in both Server and Client Components.
 */
export function withLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  layoutProps?: LayoutProps
) {
  // Returns a new component that wraps the original one
  const WithLayoutComponent = (props: P) => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 w-full">
        {/* Common Header provided by HOC */}
        <header className="bg-white shadow p-4 flex justify-between items-center w-full">
          <h1 className="text-xl font-bold">{layoutProps?.title || 'Default App Title'}</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="/ssr-example" className="hover:text-blue-600 transition-colors">SSR Example</a></li>
              <li><a href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a></li>
            </ul>
          </nav>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-grow p-8 w-full max-w-7xl mx-auto">
          <WrappedComponent {...props} />
        </main>
        
        {/* Common Footer provided by HOC */}
        <footer className="bg-gray-800 text-white p-4 text-center w-full">
          <p>&copy; {new Date().getFullYear()} Next.js Boilerplate. All rights reserved.</p>
        </footer>
      </div>
    );
  };

  // Set display name for easier debugging in React DevTools
  WithLayoutComponent.displayName = `WithLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithLayoutComponent;
}
