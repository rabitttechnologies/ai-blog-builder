
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { MapPin, Edit } from "lucide-react";

// This is a collection of cities by country code
// In a real app, this would come from an API
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco", "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville", "Detroit", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Atlanta", "Kansas City", "Miami", "Omaha", "Raleigh", "Oakland", "Minneapolis", "Tulsa", "Cleveland", "Wichita", "Arlington"],
  GB: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol", "Edinburgh", "Leeds", "Sheffield", "Newcastle", "Belfast", "Nottingham", "Southampton", "Cardiff", "Portsmouth", "Brighton", "Leicester", "Coventry", "Hull", "Plymouth", "Stoke-on-Trent", "Wolverhampton", "Derby", "Swansea", "Sunderland"],
  CA: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Quebec City", "Winnipeg", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St. John's", "Barrie", "Kelowna"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Logan City", "Geelong", "Hobart", "Townsville", "Cairns", "Toowoomba", "Darwin", "Launceston", "Albury", "Bundaberg", "Mackay"],
  DE: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster"],
  FR: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Angers", "Grenoble", "Dijon", "Nîmes", "Aix-en-Provence"],
  IN: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad"],
  JP: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai", "Shizuoka", "Kumamoto", "Okayama", "Hamamatsu", "Kagoshima"],
  CN: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan", "Tianjin", "Xi'an", "Hangzhou", "Chongqing", "Nanjing", "Zhengzhou", "Jinan", "Harbin", "Shenyang", "Changsha", "Qingdao", "Dalian", "Suzhou", "Ningbo"],
  BR: ["São Paulo", "Rio de Janeiro", "Salvador", "Brasília", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", "Goiânia", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Natal", "Teresina"],
  MX: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Ciudad Juárez", "Zapopan", "Ecatepec", "Chihuahua", "Naucalpan", "Mérida", "San Luis Potosí", "Aguascalientes", "Hermosillo", "Saltillo", "Mexicali", "Culiacán", "Querétaro", "Morelia"],
  ZA: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "Nelspruit", "Kimberley", "Polokwane", "Rustenburg", "Pietermaritzburg", "Benoni", "Vereeniging", "Witbank", "Boksburg", "Welkom", "Newcastle", "Krugersdorp", "Botshabelo", "Richards Bay"],
  IT: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Catania", "Bari", "Venice", "Messina", "Verona", "Padua", "Trieste", "Brescia", "Parma", "Taranto", "Prato", "Modena"],
  ES: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "L'Hospitalet", "La Coruña", "Granada", "Vitoria", "Elche"],
  RU: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Omsk", "Chelyabinsk", "Rostov-on-Don", "Ufa", "Volgograd", "Perm", "Krasnoyarsk", "Voronezh", "Saratov", "Krasnodar", "Tolyatti", "Izhevsk", "Barnaul", "Ulyanovsk", "Irkutsk"],
  KR: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Seongnam", "Goyang", "Bucheon", "Ansan", "Cheongju", "Anyang", "Jeonju", "Pohang", "Uijeongbu", "Hwaseong", "Pyeongtaek"],
  SG: ["Singapore"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Al Ain", "Khor Fakkan", "Dibba Al-Fujairah", "Dibba Al-Hisn", "Ar-Ruways", "Madinat Zayed", "Liwa Oasis", "Ruwais", "Jebel Ali", "Hatta", "Masfout", "Al Qusais", "Deira"],
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", "Gävle", "Borås", "Södertälje", "Eskilstuna", "Halmstad", "Växjö", "Karlstad", "Sundsvall"],
  NL: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen", "Enschede", "Apeldoorn", "Haarlem", "Arnhem", "Amersfoort", "Zaanstad", "Haarlemmermeer", "Dordrecht", "Zoetermeer", "Leiden"]
};

interface CityDropdownProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  required?: boolean;
  className?: string;
  onSelectOther?: () => void;
}

const CityDropdown: React.FC<CityDropdownProps> = ({ 
  value, 
  onChange, 
  countryCode,
  required = false, 
  className = "",
  onSelectOther
}) => {
  const cities = countryCode ? CITIES_BY_COUNTRY[countryCode] || [] : [];
  
  return (
    <Select
      value={value}
      onValueChange={(selectedValue) => {
        if (selectedValue === "other" && onSelectOther) {
          onSelectOther();
        } else {
          onChange(selectedValue);
        }
      }}
      required={required}
      disabled={!countryCode}
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
        
        {countryCode && (
          <SelectItem value="other">
            <div className="flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              <span>Other (type your city)</span>
            </div>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default CityDropdown;
