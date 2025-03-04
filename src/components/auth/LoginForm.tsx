
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to BlogCraft!",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-1">
            <a href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
        >
          Log In
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
