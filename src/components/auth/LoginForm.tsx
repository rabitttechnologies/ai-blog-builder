import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CityDropdown from "./CityDropdown";
import CountryDropdown from "./CountryDropdown";
import CountryCodeDropdown from "./CountryCodeDropdown";
import { Input } from "@/components/ui/input";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1"); // Default to US code
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("US"); // Default to US
  const [otherCity, setOtherCity] = useState("");
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Combine country code and phone number
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    
    // Get the actual city (either selected from dropdown or manually entered)
    const actualCity = isCustomCity ? otherCity : city;
    
    if (!email || !password || !phoneNumber || !organization || !actualCity || !country) {
      setError("Please fill in all the required fields");
      return;
    }
    
    // Basic phone validation - just check for digits now since we have the country code separate
    const phoneRegex = /^[0-9]{6,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number (6-15 digits, numbers only)");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // We'll pass all the user data to the login function
      await login(email, password, {
        phone: fullPhoneNumber,
        organization,
        city: actualCity,
        country
      });
      
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
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-1">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="w-1/3">
              <CountryCodeDropdown
                value={countryCode}
                onChange={setCountryCode}
                required
              />
            </div>
            <div className="w-2/3">
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>
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
          <CountryDropdown 
            value={country} 
            onChange={(code) => {
              setCountry(code);
              // Reset city when country changes
              setCity("");
              setIsCustomCity(false);
            }}
            required 
            showAllCountries={true}
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          {isCustomCity ? (
            <Input
              id="otherCity"
              type="text"
              placeholder="Enter your city"
              value={otherCity}
              onChange={(e) => setOtherCity(e.target.value)}
              required
            />
          ) : (
            <CityDropdown 
              value={city} 
              onChange={setCity} 
              countryCode={country}
              required
              onSelectOther={() => setIsCustomCity(true)}
            />
          )}
          {isCustomCity && (
            <button 
              type="button" 
              className="text-xs text-primary hover:underline mt-1"
              onClick={() => setIsCustomCity(false)}
            >
              Choose from list
            </button>
          )}
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
