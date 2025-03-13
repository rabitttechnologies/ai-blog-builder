
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Country codes with flag emojis
const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" }
];

interface CountryCodeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({ 
  value,
  onChange,
  required = false,
  className = ""
}) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder="Select code" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRY_CODES.map((country) => (
          <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
            <div className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              <span>{country.code}</span>
              <span className="ml-2 text-muted-foreground text-xs">({country.name})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountryCodeDropdown;
