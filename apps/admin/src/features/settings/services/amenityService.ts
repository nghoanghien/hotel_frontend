import { http, ApiResponse } from '@repo/api';
import { Amenity, CreateAmenityDto, UpdateAmenityDto, AmenityType } from '@repo/types';

// API Endpoints
const ENDPOINTS = {
  amenities: '/amenities',
  amenityById: (id: string) => `/amenities/${id}`,
  amenitiesByType: (type: AmenityType) => `/amenities/type/${type}`,
} as const;

// Service Implementation
export const amenityService = {
  // GET /api/amenities - Get all amenities (including inactive)
  getAllAmenities: async (): Promise<Amenity[]> => {
    const response = await http.get<ApiResponse<Amenity[]>>(ENDPOINTS.amenities);
    return (response as any).data;
  },

  // GET /api/amenities/{id}
  getAmenityById: async (id: string): Promise<Amenity | null> => {
    try {
      const response = await http.get<ApiResponse<Amenity>>(ENDPOINTS.amenityById(id));
      return (response as any).data;
    } catch (error) {
      console.error('Failed to get amenity:', error);
      return null;
    }
  },

  // GET /api/amenities/type/{type}
  getAmenitiesByType: async (type: AmenityType): Promise<Amenity[]> => {
    const response = await http.get<ApiResponse<Amenity[]>>(ENDPOINTS.amenitiesByType(type));
    return (response as any).data;
  },

  // POST /api/amenities - Create new amenity
  createAmenity: async (data: CreateAmenityDto): Promise<Amenity> => {
    const response = await http.post<ApiResponse<Amenity>>(ENDPOINTS.amenities, data);
    return (response as any).data;
  },

  // PUT /api/amenities/{id} - Update amenity
  updateAmenity: async (id: string, data: UpdateAmenityDto): Promise<Amenity> => {
    const response = await http.put<ApiResponse<Amenity>>(ENDPOINTS.amenityById(id), data);
    return (response as any).data;
  },

  // DELETE /api/amenities/{id} - Delete amenity
  deleteAmenity: async (id: string): Promise<boolean> => {
    const response = await http.delete<ApiResponse<boolean>>(ENDPOINTS.amenityById(id));
    return (response as any).data;
  },

  // Get statistics calculated locally from the full list
  getStats: async () => {
    const amenities = await amenityService.getAllAmenities();

    return {
      total: amenities.length,
      active: amenities.filter(a => a.isActive).length,
      inactive: amenities.filter(a => !a.isActive).length,
      byType: {
        general: amenities.filter(a => a.type === AmenityType.General).length,
        room: amenities.filter(a => a.type === AmenityType.Room).length,
        bathroom: amenities.filter(a => a.type === AmenityType.Bathroom).length,
        kitchen: amenities.filter(a => a.type === AmenityType.Kitchen).length,
        entertainment: amenities.filter(a => a.type === AmenityType.Entertainment).length,
        service: amenities.filter(a => a.type === AmenityType.Service).length,
        facilities: amenities.filter(a => a.type === AmenityType.Facilities).length,
      }
    };
  }
};
