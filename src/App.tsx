
import React from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import BlogCreation from "@/pages/BlogCreation";
import BlogDetail from "@/pages/BlogDetail";
import NotFound from "@/pages/NotFound";
import ServerError from "@/pages/ServerError";
import Support from "@/pages/Support";
import { AuthProvider } from "@/context/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/context/language/LanguageContext";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/blogs" element={<BlogCreation />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/support" element={<Support />} />
                <Route path="/error" element={<ServerError />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
