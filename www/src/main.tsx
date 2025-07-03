import ReactDOM from "react-dom/client";

function App() {
  return <p className="bg-red-500">Hello, World!</p>;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(<App />);
