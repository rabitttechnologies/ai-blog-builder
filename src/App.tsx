
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { LanguageProvider, useLanguage, SUPPORTED_LANGUAGES } from "./context/language/LanguageContext";
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
import BlogCreation from "./pages/BlogCreation";
import API from "./pages/API";
import Support from "./pages/Support";
import Enterprise from "./pages/Enterprise";
import Careers from "./pages/Careers";
import { getLanguageFromPath } from "./utils/languageUtils";

// Create a new QueryClient instance
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

// Language Route Detector component
const LanguageRouteDetector = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, setLanguage } = useLanguage();
  
  useEffect(() => {
    // Check if the URL contains a language code
    const pathLanguage = getLanguageFromPath(location.pathname);
    
    if (pathLanguage && pathLanguage !== currentLanguage) {
      // If the URL has a language code different from the current one, update the language
      setLanguage(pathLanguage);
    } else if (!pathLanguage && currentLanguage !== 'en') {
      // If the URL doesn't have a language code and we're not in English, redirect
      const newPath = `/${currentLanguage}${location.pathname}`;
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, currentLanguage, setLanguage, navigate]);
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentLanguage, getLocalizedPath } = useLanguage();
  
  // Create localized routes for all supported languages
  return (
    <Routes>
      {/* Default routes (English) */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/security" element={<Security />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/blogs" element={<BlogCreation />} />
      <Route path="/account" element={<Account />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/subscription/checkout" element={<Checkout />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/error" element={<NotFound />} />
      <Route path="/server-error" element={<ServerError />} />
      <Route path="/api" element={<API />} />
      <Route path="/support" element={<Support />} />
      <Route path="/enterprise" element={<Enterprise />} />
      <Route path="/careers" element={<Careers />} />
      
      {/* Localized routes for non-English languages */}
      {SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'en').map(lang => (
        <React.Fragment key={lang.code}>
          <Route path={`/${lang.code}`} element={<Index />} />
          <Route path={`/${lang.code}/login`} element={<Login />} />
          <Route path={`/${lang.code}/signup`} element={<Signup />} />
          <Route path={`/${lang.code}/forgot-password`} element={<ForgotPassword />} />
          <Route path={`/${lang.code}/reset-password`} element={<ResetPassword />} />
          <Route path={`/${lang.code}/pricing`} element={<Pricing />} />
          <Route path={`/${lang.code}/about`} element={<AboutUs />} />
          <Route path={`/${lang.code}/blog`} element={<Blog />} />
          <Route path={`/${lang.code}/features`} element={<Features />} />
          <Route path={`/${lang.code}/contact`} element={<ContactUs />} />
          <Route path={`/${lang.code}/privacy`} element={<Privacy />} />
          <Route path={`/${lang.code}/terms`} element={<Terms />} />
          <Route path={`/${lang.code}/guides`} element={<Guides />} />
          <Route path={`/${lang.code}/security`} element={<Security />} />
          <Route path={`/${lang.code}/dashboard`} element={<Dashboard />} />
          <Route path={`/${lang.code}/blogs`} element={<BlogCreation />} />
          <Route path={`/${lang.code}/account`} element={<Account />} />
          <Route path={`/${lang.code}/subscription`} element={<Subscription />} />
          <Route path={`/${lang.code}/subscription/checkout`} element={<Checkout />} />
          <Route path={`/${lang.code}/admin`} element={<AdminDashboard />} />
          <Route path={`/${lang.code}/error`} element={<NotFound />} />
          <Route path={`/${lang.code}/server-error`} element={<ServerError />} />
          <Route path={`/${lang.code}/api`} element={<API />} />
          <Route path={`/${lang.code}/support`} element={<Support />} />
          <Route path={`/${lang.code}/enterprise`} element={<Enterprise />} />
          <Route path={`/${lang.code}/careers`} element={<Careers />} />
        </React.Fragment>
      ))}

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <ErrorBoundary redirectTo="/error">
              <LanguageRouteDetector>
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
                <AppRoutes />
              </LanguageRouteDetector>
            </ErrorBoundary>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
