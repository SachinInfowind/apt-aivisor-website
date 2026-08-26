import React from 'react';

// This is a Server Component by default in Next.js App Router (App router uses RSCs).
// By fetching data inside this component without using 'use client', 
// Next.js will Server-Side Render (SSR) this page and stream the result to the client.

/**
 * Simulated API call that fetches data on the server.
 * This demonstrates how to fetch data directly in a Server Component.
 */
async function fetchServerData() {
  // In a real application, this would be an actual fetch request or a database query.
  // Using Server Components allows direct database access without exposing credentials to the client.
  return new Promise<{ message: string, timestamp: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Data fetched securely on the server-side!",
        timestamp: new Date().toISOString()
      });
    }, 1000); // Simulate network delay
  });
}

/**
 * SSRPage Component
 * 
 * Demonstrates Server-Side Rendering (SSR) functionality.
 * As an async component, it pauses rendering until the data is fetched,
 * and the HTML sent to the browser includes the fully populated content.
 */
export default async function SSRPage() {
  // This function call blocks the render on the server until data is ready.
  // Sensitive tokens (like API keys) can be used here without leaking to the client.
  const data = await fetchServerData();

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Server-Side Rendered Page</h1>
      <p className="mb-6 text-gray-600 leading-relaxed">
        This page demonstrates Server-Side Rendering (SSR) in the Next.js App Router.
        The data below was fetched securely on the server before being sent to the browser as pre-rendered HTML.
        This provides excellent SEO and fast First Contentful Paint (FCP).
      </p>
      
      <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Fetched Server Data:</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><span className="font-semibold text-gray-900">Message:</span> {data.message}</li>
          <li><span className="font-semibold text-gray-900">Rendered At:</span> {data.timestamp}</li>
        </ul>
      </div>
      
      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </a>
      </div>
    </div>
  );
}
