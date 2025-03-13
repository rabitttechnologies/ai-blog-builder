
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <Helmet>
        <title>Reset Password - BlogCraft</title>
      </Helmet>
      
      <div className="w-full max-w-md mb-8">
        <Link to="/" className="inline-block mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            BlogCraft
          </h1>
        </Link>
        <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
        <p className="text-foreground/70 mb-8">
          Enter your email and we'll send you instructions to reset your password.
        </p>
        
        <ForgotPasswordForm />
        
        <p className="text-center mt-8 text-foreground/70">
          Remember your password?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
