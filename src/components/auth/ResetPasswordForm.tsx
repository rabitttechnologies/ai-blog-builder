
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Password strength validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated",
      });
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again or request a new reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glass p-6 rounded-xl">
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex flex-col items-center text-center">
          <CheckCircle className="h-12 w-12 mb-2 text-green-500" />
          <h3 className="text-lg font-medium mb-2">Password reset complete</h3>
          <p className="text-sm">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
        </div>
        <Button 
          type="button" 
          onClick={() => navigate("/login")}
          fullWidth
        >
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-xl">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
