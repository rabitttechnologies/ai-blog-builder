import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CheckCircle, AlertCircle, Globe, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CityDropdown from "./CityDropdown";
import CountryDropdown, { COUNTRIES } from "./CountryDropdown";
import CountryCodeDropdown from "./CountryCodeDropdown";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!name || !phoneNumber || !organization || !city || !countryValue || !countryCode) {
      setError("Please fill in all the required fields");
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^[0-9]{6,12}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number (6-12 digits)");
      return;
    }

    const selectedCountry = COUNTRIES.find(country => country.code === countryValue);
    const countryName = selectedCountry ? selectedCountry.name : countryValue;
    
    setIsSubmitting(true);
    
    try {
      // Format the phone with country code
      const fullPhone = `${countryCode}${phoneNumber}`;
      
      // We'll pass all the user data to the signup function
      await signup(email, password, {
        name,
        phone: fullPhone,
        organization,
        city,
        country: countryName
      });
      
      toast({
        title: "Account created successfully",
        description: "Welcome to your free trial of BlogCraft!",
      });
      setSuccess(true);
      // Wait a bit before redirecting
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold">Account Created!</h3>
        <p className="text-foreground/70 max-w-sm mx-auto">
          Your free trial is now active. You'll be redirected to your dashboard where you can start creating blogs.
        </p>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-2 text-center">Start Your Free Trial</h3>
      <p className="text-sm text-foreground/70 mb-6 text-center">
        No credit card required. Get 2 free blogs for 14 days.
      </p>
      
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
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <div className="w-1/3">
              <CountryCodeDropdown
                value={countryCode}
                onChange={setCountryCode}
                required
              />
            </div>
            <div className="w-2/3">
              <input
                id="phone"
                type="tel"
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-foreground/60">
            Enter numbers only, no spaces or special characters
          </p>
        </div>
        
        <div>
          <label htmlFor="organization" className="block text-sm font-medium mb-1">
            Organization Name <span className="text-red-500">*</span>
          </label>
          <input
            id="organization"
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
            placeholder="Your company or organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
            <div className="w-full">
              <CountryDropdown 
                value={countryValue} 
                onChange={(code) => {
                  setCountryValue(code);
                  // Reset city when country changes
                  setCity("");
                }} 
                required 
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <div className="w-full">
              <CityDropdown 
                value={city} 
                onChange={setCity}
                countryCode={countryValue}
                required 
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <p className="mt-1 text-xs text-foreground/60">
            Must be at least 8 characters
          </p>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
        
        <p className="text-xs text-center text-foreground/60 pt-2">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
