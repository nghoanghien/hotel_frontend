import {
  Wifi,
  Waves,
  UtensilsCrossed,
  Wine,
  Sparkles,
  Dumbbell,
  ParkingCircle,
  Plane,
  Coffee,
  Bed,
  ShowerHead,
  Tv,
  AirVent,
  Refrigerator,
  Microwave,
  CookingPot,
  WashingMachine,
  Shirt,
  Heater,
  Wind,
  Lock,
  Cctv,
  Accessibility,
  Baby,
  PawPrint,
  CigaretteOff,
  Mountain,
  Flower2,
  Trees,
  Bike,
  Car,
  Bus,
  Sofa,
  Laptop,
  BookOpen,
  Music,
  Gamepad2,
  Film,
  Volleyball,
  LucideIcon,
  CircleHelp
} from 'lucide-react';

// Common amenity icon mapping based on amenity name or keywords
export const AMENITY_ICON_MAP: Record<string, LucideIcon> = {
  // General Amenities
  'wifi': Wifi,
  'internet': Wifi,
  'pool': Waves,
  'swimming': Waves,
  'restaurant': UtensilsCrossed,
  'dining': UtensilsCrossed,
  'bar': Wine,
  'spa': Sparkles,
  'massage': Sparkles,
  'gym': Dumbbell,
  'fitness': Dumbbell,
  'parking': ParkingCircle,
  'airport': Plane,
  'shuttle': Bus,
  'breakfast': Coffee,
  'coffee': Coffee,

  // Room Amenities
  'bed': Bed,
  'bedroom': Bed,
  'tv': Tv,
  'television': Tv,
  'air': AirVent,
  'conditioning': AirVent,
  'ac': AirVent,
  'desk': Laptop,
  'workspace': Laptop,
  'sofa': Sofa,
  'seating': Sofa,
  'balcony': Mountain,
  'view': Mountain,
  'wardrobe': BookOpen,
  'closet': BookOpen,

  // Bathroom
  'bathroom': ShowerHead,
  'shower': ShowerHead,
  'bathtub': ShowerHead,
  'hairdryer': Wind,
  'toiletries': Sparkles,

  // Kitchen
  'kitchen': Refrigerator,
  'refrigerator': Refrigerator,
  'fridge': Refrigerator,
  'microwave': Microwave,
  'stove': CookingPot,
  'oven': CookingPot,
  'cookware': CookingPot,
  'kettle': Coffee,

  // Entertainment
  'entertainment': Tv,
  'cable': Tv,
  'streaming': Film,
  'netflix': Film,
  'music': Music,
  'speaker': Music,
  'games': Gamepad2,
  'gaming': Gamepad2,
  'books': BookOpen,
  'library': BookOpen,

  // Service
  'laundry': WashingMachine,
  'washing': WashingMachine,
  'iron': Shirt,
  'ironing': Shirt,
  'cleaning': Sparkles,
  'housekeeping': Sparkles,
  'concierge': CircleHelp,
  'reception': CircleHelp,
  '24': Lock,
  'security': Lock,
  'cctv': Cctv,
  'safe': Lock,

  // Facilities
  'garden': Flower2,
  'terrace': Trees,
  'bbq': CookingPot,
  'grill': CookingPot,
  'bike': Bike,
  'bicycle': Bike,
  'car': Car,
  'rental': Car,
  'accessible': Accessibility,
  'wheelchair': Accessibility,
  'elevator': Accessibility,
  'lift': Accessibility,
  'baby': Baby,
  'crib': Baby,
  'pet': PawPrint,
  'animal': PawPrint,
  'smoking': CigaretteOff,
  'smoke': CigaretteOff,
  'heat': Heater,
  'heater': Heater,
  'fireplace': Heater,
  'volleyball': Volleyball,
  'sport': Volleyball,
};

/**
 * Get the appropriate icon for an amenity based on its name
 * Falls back to a default icon if no match is found
 */
export function getAmenityIcon(amenityName: string): LucideIcon {
  const lowerName = amenityName.toLowerCase();

  // Check for exact or partial matches
  for (const [key, icon] of Object.entries(AMENITY_ICON_MAP)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }

  // Default fallback icon - Sparkles represents amenities/features
  return Sparkles;
}

/**
 * Get icon component for an amenity with optional className
 */
export function AmenityIcon({
  amenityName,
  className = "w-5 h-5"
}: {
  amenityName: string;
  className?: string;
}) {
  const Icon = getAmenityIcon(amenityName);
  return <Icon className={className} />;
}
