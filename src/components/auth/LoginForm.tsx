
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormAuthWrapper from "./FormAuthWrapper";

// Move form schema outside component to prevent recreation on render
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const renderTimeRef = useRef(performance.now());
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form initialization with memoized resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  // Register form interactions for performance monitoring
  useEffect(() => {
    const renderTime = performance.now() - renderTimeRef.current;
    console.log(`LoginForm component render time: ${Math.round(renderTime)}ms`);
    
    // Register interaction observers for form inputs
    const formElement = formRef.current;
    if (formElement) {
      const inputElements = formElement.querySelectorAll('input');
      
      const observeInteractions = (elements: NodeListOf<HTMLInputElement>) => {
        elements.forEach(input => {
          input.addEventListener('focus', () => {
            const startTime = performance.now();
            input.dataset.interactionStart = startTime.toString();
          });
          
          input.addEventListener('blur', () => {
            if (input.dataset.interactionStart) {
              const startTime = parseFloat(input.dataset.interactionStart);
              const endTime = performance.now();
              console.log(`Input interaction time (${input.name}): ${Math.round(endTime - startTime)}ms`);
            }
          });
        });
      };
      
      observeInteractions(inputElements);
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const startTime = performance.now();
    setError("");
    setIsSubmitting(true);
    
    try {
      await login(values.email, values.password);
      
      // Log authentication performance
      const authTime = performance.now() - startTime;
      console.log(`Authentication process time: ${Math.round(authTime)}ms`);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Use requestIdleCallback to delay navigation slightly for toast to be visible
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          navigate("/dashboard");
        }, { timeout: 300 });
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 300);
      }
    } catch (err: any) {
      const errorTime = performance.now() - startTime;
      console.log(`Authentication error time: ${Math.round(errorTime)}ms`);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormAuthWrapper>
      <div className="glass p-6 rounded-xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your password"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-primary text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
            >
              Log In
            </Button>
          </form>
        </Form>
      </div>
    </FormAuthWrapper>
  );
};

export default LoginForm;
