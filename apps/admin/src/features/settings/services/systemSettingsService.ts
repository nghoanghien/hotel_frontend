import { http, ApiResponse } from '@repo/api';
import { HotelDetailDto, UpdateHotelDto } from '@repo/types';

export const systemSettingsService = {
    /**
     * Get settings for a specific hotel
     */
    getHotelSettings: async (hotelId: string): Promise<ApiResponse<HotelDetailDto>> => {
        const response = await http.get<ApiResponse<HotelDetailDto>>(`/hotels/${hotelId}`);
        return response as any;
    },

    /**
     * Update settings for a specific hotel
     */
    updateHotelSettings: async (hotelId: string, data: UpdateHotelDto): Promise<ApiResponse<HotelDetailDto>> => {
        const response = await http.put<ApiResponse<HotelDetailDto>>(`/hotels/${hotelId}`, data);
        return response as any;
    }
};
