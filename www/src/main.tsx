import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance
const router = createRouter({ routeTree });

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
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  enableMocking().then(() => {
    root.render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    );
  });
}
