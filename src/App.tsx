
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
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
import Account from "./pages/Account";
import Subscription from "./pages/Subscription";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import { Helmet } from "react-helmet";

// New pages
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Features from "./pages/Features";
import ContactUs from "./pages/ContactUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Guides from "./pages/Guides";
import Security from "./pages/Security";

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
          <Helmet
            titleTemplate="%s | Insight Writer AI"
            defaultTitle="Rank #1 with AI Blogging Tools - AI Blog Writer & Article Generator for Blogger"
          >
            <meta 
              name="description" 
              content="Use our efficient ai article writer and blog writer for superior article writing and efficient blog writing, helping every blogger create high-quality articles and elevate their blogging presence. Explore AI-powered writing today!" 
            />
          </Helmet>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* New public routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/security" element={<Security />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Removed blog creation route */}
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
        </ErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
