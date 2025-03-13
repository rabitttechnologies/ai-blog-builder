
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPassword = () => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');
    
    if (!resetToken) {
      // If no token is provided, redirect to forgot password page
      navigate('/forgot-password');
      return;
    }
    
    setToken(resetToken);
  }, [location, navigate]);

  if (!token) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <Helmet>
        <title>Create New Password - BlogCraft</title>
      </Helmet>
      
      <div className="w-full max-w-md mb-8">
        <Link to="/" className="inline-block mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            BlogCraft
          </h1>
        </Link>
        <h2 className="text-2xl font-bold mb-2">Create a new password</h2>
        <p className="text-foreground/70 mb-8">
          Enter your new password below to reset your account access.
        </p>
        
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

export default ResetPassword;
