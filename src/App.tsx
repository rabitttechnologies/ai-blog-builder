
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BlogCreate from "./pages/BlogCreate";
import Account from "./pages/Account";
import Subscription from "./pages/Subscription";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import { Helmet } from "react-helmet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Helmet titleTemplate="%s | BlogCraft" defaultTitle="BlogCraft - AI Blog Generator">
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
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blog/create" element={<BlogCreate />} />
            <Route path="/account" element={<Account />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/subscription/checkout" element={<Checkout />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
