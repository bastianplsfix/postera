import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter as createRouterInstance, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProvider } from "convex/react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

export function createRouter() {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

  if (!CONVEX_URL) {
    console.error("missing environment variable VITE_CONVEX_URL");
  }

  // Create a convex client
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

  // Create a client
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);

  // Create a new router instance
  const router = routerWithQueryClient(createRouterInstance({
    routeTree,
    defaultPreload: "intent",
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    context: {
      queryClient,
    },
    Wrap: ({ children }) => (
            <ConvexProvider client={convexQueryClient.convexClient}>
              {children}
            </ConvexProvider>
    ),
  }),
  queryClient
  );

   return router;
}

const router = createRouter()

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    return;
  }

  const { worker } = await import("./tests/mocks/browser.ts");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

// Render the app
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
  );
});
