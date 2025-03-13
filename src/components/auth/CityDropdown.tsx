
import React from "react";

// This is a simplified list - in a real app you might fetch this from an API
const CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "London",
  "Paris",
  "Tokyo",
  "Sydney",
  "Berlin",
  "Toronto",
  "Mumbai",
  "Shanghai",
  "Singapore",
  "Dubai"
];

interface CityDropdownProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const CityDropdown: React.FC<CityDropdownProps> = ({ value, onChange, required = false, className = "" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all ${className}`}
    >
      <option value="">Select a city</option>
      {CITIES.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
};

export default CityDropdown;
