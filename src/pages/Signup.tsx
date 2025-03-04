
import React from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate } from "react-router-dom";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <Helmet>
        <title>Start Free Trial - BlogCraft</title>
      </Helmet>
      
      <div className="w-full max-w-md mb-8">
        <Link to="/" className="inline-block mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            BlogCraft
          </h1>
        </Link>
        <h2 className="text-2xl font-bold mb-2">Start Your Free Trial</h2>
        <p className="text-foreground/70 mb-8">Create 2 free blogs in 14 days with no credit card required.</p>
        
        <SignupForm />
        
        <p className="text-center mt-8 text-foreground/70">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
