import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="bg-gray-100 border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Todo Lists</h1>
            <nav className="flex gap-4">
              <Link
                to="/"
                className="px-3 py-2 rounded hover:bg-gray-200 [&.active]:bg-blue-500 [&.active]:text-white"
              >
                All Todos
              </Link>
              <Link
                to="/lists"
                className="px-3 py-2 rounded hover:bg-gray-200 [&.active]:bg-blue-500 [&.active]:text-white"
              >
                Manage Lists
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded hover:bg-gray-200 [&.active]:bg-blue-500 [&.active]:text-white"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  ),
});
