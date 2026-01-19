import { Amenity, CreateAmenityDto, UpdateAmenityDto, AmenityType } from '@repo/types';

// Mock data
const mockAmenities: Amenity[] = [
  // Room Amenities
  {
    id: '1',
    name: 'Air Conditioning',
    description: 'Climate control system for optimal room temperature',
    icon: 'Wind',
    type: AmenityType.Room,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Smart TV',
    description: '55" 4K Smart TV with streaming services',
    icon: 'Tv',
    type: AmenityType.Entertainment,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Free WiFi',
    description: 'High-speed wireless internet access',
    icon: 'Wifi',
    type: AmenityType.Service,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Mini Bar',
    description: 'Fully stocked mini refrigerator with beverages and snacks',
    icon: 'Coffee',
    type: AmenityType.Kitchen,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Safe',
    description: 'In-room electronic safe for valuables',
    icon: 'ShieldCheck',
    type: AmenityType.Room,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Bathroom Amenities
  {
    id: '6',
    name: 'Hair Dryer',
    description: 'Professional hair dryer',
    icon: 'Wind',
    type: AmenityType.Bathroom,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'Bathtub',
    description: 'Luxury bathtub with premium fixtures',
    icon: 'Droplet',
    type: AmenityType.Bathroom,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Premium Toiletries',
    description: 'Luxury bath products',
    icon: 'Sparkles',
    type: AmenityType.Bathroom,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Facilities
  {
    id: '9',
    name: 'Swimming Pool',
    description: 'Outdoor infinity pool with city view',
    icon: 'Waves',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    name: 'Fitness Center',
    description: '24/7 fully equipped gym',
    icon: 'Dumbbell',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '11',
    name: 'Spa & Wellness',
    description: 'Full-service spa with massage and treatments',
    icon: 'Sparkles',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    name: 'Restaurant',
    description: 'On-site fine dining restaurant',
    icon: 'UtensilsCrossed',
    type: AmenityType.Service,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '13',
    name: 'Room Service',
    description: '24-hour room service',
    icon: 'Bell',
    type: AmenityType.Service,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '14',
    name: 'Parking',
    description: 'Free on-site parking',
    icon: 'Car',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '15',
    name: 'EV Charging Station',
    description: 'Electric vehicle charging points',
    icon: 'Zap',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '16',
    name: 'Fax Machine',
    description: 'Fax services (deprecated)',
    icon: 'FileText',
    type: AmenityType.Service,
    isActive: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '17',
    name: 'Private Beach Access',
    description: 'Direct access to private beach area with sunbeds',
    icon: 'Umbrella',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '18',
    name: 'Golf Course',
    description: '18-hole championship golf course',
    icon: 'Trophy',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '19',
    name: 'Kids Club',
    description: 'Supervised activities and play area for children',
    icon: 'Gamepad2',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '20',
    name: 'Executive Lounge',
    description: 'Exclusive lounge access with complimentary refreshments',
    icon: 'Crown',
    type: AmenityType.Service,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '21',
    name: 'Butler Service',
    description: '24/7 personal butler service',
    icon: 'UserCheck',
    type: AmenityType.Service,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '22',
    name: 'Infinity Pool',
    description: 'Rooftop infinity pool with panoramic views',
    icon: 'Waves',
    type: AmenityType.Facilities,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

let amenitiesData = [...mockAmenities];

export const amenityService = {
  // GET /api/amenities
  getAllAmenities: async (): Promise<Amenity[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...amenitiesData]; // Return ALL for admin management
  },

  // GET /api/amenities/{id}
  getAmenityById: async (id: string): Promise<Amenity | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return amenitiesData.find(a => a.id === id) || null;
  },

  // GET /api/amenities/type/{type}
  getAmenitiesByType: async (type: AmenityType): Promise<Amenity[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return amenitiesData.filter(a => a.type === type && a.isActive);
  },

  // POST /api/amenities
  createAmenity: async (data: CreateAmenityDto): Promise<Amenity> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newAmenity: Amenity = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    amenitiesData.push(newAmenity);
    return newAmenity;
  },

  // PUT /api/amenities/{id}
  updateAmenity: async (id: string, data: UpdateAmenityDto): Promise<Amenity> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = amenitiesData.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Amenity not found');

    amenitiesData[index] = {
      ...amenitiesData[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return amenitiesData[index];
  },

  // DELETE /api/amenities/{id}
  deleteAmenity: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = amenitiesData.findIndex(a => a.id === id);
    if (index === -1) return false;

    amenitiesData.splice(index, 1);
    return true;
  },

  // Get statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      total: amenitiesData.length,
      active: amenitiesData.filter(a => a.isActive).length,
      inactive: amenitiesData.filter(a => !a.isActive).length,
      byType: {
        general: amenitiesData.filter(a => a.type === AmenityType.General).length,
        room: amenitiesData.filter(a => a.type === AmenityType.Room).length,
        bathroom: amenitiesData.filter(a => a.type === AmenityType.Bathroom).length,
        kitchen: amenitiesData.filter(a => a.type === AmenityType.Kitchen).length,
        entertainment: amenitiesData.filter(a => a.type === AmenityType.Entertainment).length,
        service: amenitiesData.filter(a => a.type === AmenityType.Service).length,
        facilities: amenitiesData.filter(a => a.type === AmenityType.Facilities).length,
      }
    };
  }
};
