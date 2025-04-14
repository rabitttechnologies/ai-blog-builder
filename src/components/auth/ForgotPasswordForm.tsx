
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import FormAuthWrapper from "./FormAuthWrapper";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await requestPasswordReset(email);
      setSuccess(true);
      toast({
        title: "Email sent",
        description: "Check your inbox for password reset instructions",
      });
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <FormAuthWrapper>
        <div className="glass p-6 rounded-xl">
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex flex-col items-center text-center">
            <CheckCircle className="h-12 w-12 mb-2 text-green-500" />
            <h3 className="text-lg font-medium mb-2">Check your email</h3>
            <p className="text-sm">
              We've sent password reset instructions to {email}. Please check your inbox
              (and spam folder) for further instructions.
            </p>
          </div>
          <Button 
            type="button" 
            onClick={() => navigate("/login")}
            fullWidth
          >
            Back to login
          </Button>
        </div>
      </FormAuthWrapper>
    );
  }

  return (
    <FormAuthWrapper>
      <div className="glass p-6 rounded-xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
          >
            Send Reset Instructions
          </Button>
        </form>
      </div>
    </FormAuthWrapper>
  );
};

export default ForgotPasswordForm;
