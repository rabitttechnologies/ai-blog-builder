
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

// This is a collection of cities by country code
// In a real app, this would come from an API
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
  GB: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol", "Edinburgh", "Leeds"],
  CA: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Quebec City"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra"],
  DE: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf"],
  FR: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg"],
  IN: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"],
  JP: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo", "Fukuoka"],
  CN: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan", "Tianjin"],
  BR: ["São Paulo", "Rio de Janeiro", "Salvador", "Brasília", "Fortaleza", "Belo Horizonte"],
  MX: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León"],
  ZA: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
  IT: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna"],
  ES: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga"],
  RU: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Omsk"],
  KR: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju"],
  SG: ["Singapore"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah"],
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro"],
  NL: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg"]
};

interface CityDropdownProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  required?: boolean;
  className?: string;
}

const CityDropdown: React.FC<CityDropdownProps> = ({ 
  value, 
  onChange, 
  countryCode,
  required = false, 
  className = "" 
}) => {
  const cities = countryCode ? CITIES_BY_COUNTRY[countryCode] || [] : [];
  
  return (
    <Select
      value={value}
      onValueChange={onChange}
      required={required}
      disabled={!countryCode || cities.length === 0}
    >
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={countryCode ? "Select a city" : "Select a country first"} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {cities.length === 0 && countryCode && (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            No cities available for the selected country
          </div>
        )}
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{city}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CityDropdown;
