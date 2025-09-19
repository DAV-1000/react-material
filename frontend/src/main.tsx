import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { StyledEngineProvider } from '@mui/styled-engine'; 
import { PostCommandServiceProvider } from "./services/PostCommandServiceContext.tsx";
import { PostQueryServiceProvider } from "./services/PostQueryServiceContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <AuthProvider>
          <PostQueryServiceProvider>
        <PostCommandServiceProvider>
        <App />
        </PostCommandServiceProvider>
        </PostQueryServiceProvider>
        </AuthProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </StrictMode>
);
