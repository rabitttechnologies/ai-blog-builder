
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
import { AuthProvider } from "@/context/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
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
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
