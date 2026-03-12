import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./styles/main.css";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        toastOptions={{
          classNames: {
            error: "!bg-[#F44336] !text-white !border-[#D32F2F]",
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
