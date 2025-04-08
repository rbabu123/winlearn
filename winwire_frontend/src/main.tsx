import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { App } from './App';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient
import "./styles.css";

const root = createRoot(document.getElementById("root")!);

// Create a QueryClient instance
const queryClient = new QueryClient();

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);
