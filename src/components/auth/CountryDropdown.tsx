
import React from "react";

// This is a simplified list - in a real app you might fetch this from an API
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "South Africa",
  "Italy",
  "Spain",
  "Russia",
  "South Korea",
  "Singapore",
  "United Arab Emirates",
  "Sweden",
  "Netherlands"
];

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({ value, onChange, required = false, className = "" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all ${className}`}
    >
      <option value="">Select a country</option>
      {COUNTRIES.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

export default CountryDropdown;
