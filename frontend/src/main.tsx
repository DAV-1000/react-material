import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { StyledEngineProvider } from '@mui/styled-engine'; 
import { BlogPostServiceProvider } from "./services/BlogPostServiceContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <BlogPostServiceProvider>
        <App />
        </BlogPostServiceProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </StrictMode>
);
