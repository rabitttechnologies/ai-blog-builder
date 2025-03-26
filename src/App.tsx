
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import BlogCreate from "./pages/BlogCreate";
import Account from "./pages/Account";
import Subscription from "./pages/Subscription";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import { Helmet } from "react-helmet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      meta: {
        onError: (error: unknown) => {
          console.error("Query error:", error);
          // If it's a server error, we could redirect to the server error page
          if (error instanceof Error && error.message.includes("Network") || 
              error instanceof Error && error.message.includes("500")) {
            window.location.href = "/server-error";
          }
        }
      }
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ErrorBoundary redirectTo="/error">
          <Helmet titleTemplate="%s | Insight Writer AI" defaultTitle="Insight Writer AI - AI Blog Generator">
            <meta name="description" content="Create SEO-optimized blogs with AI and human-in-the-loop approval" />
          </Helmet>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blog/create" element={<BlogCreate />} />
              <Route path="/account" element={<Account />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/subscription/checkout" element={<Checkout />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Error routes */}
              <Route path="/error" element={<NotFound />} />
              <Route path="/server-error" element={<ServerError />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
