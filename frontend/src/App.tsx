import { lazy, Suspense } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AppTheme from "./shared-theme/AppTheme";

import { Routes, Route } from "react-router-dom";

import AppAppBar from "./components/AppAppBar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
const Features = lazy(() => import("./pages/Features"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Highlights = lazy(() => import("./pages/Highlights"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const EditPost = lazy(() => import("./pages/EditPost"));
const ProtectedRoute = lazy(() => import("./context/ProtectedRoute"));
const CreatePost = lazy(() => import("./pages/CreatePost"));

export default function App(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route
              path="/blog"
              element={
                <ProtectedRoute>
                  <Blog />
                </ProtectedRoute>
              }
            />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route
              path="/edit-post/:id"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </Container>
      <Footer />
    </AppTheme>
  );
}
