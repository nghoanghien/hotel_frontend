import { http, ApiResponse } from '@repo/api';
import {
    SubscriptionPlanDto,
    CreateSubscriptionPlanDto,
    UpdateSubscriptionPlanDto
} from '@repo/types';

export const subscriptionPlanService = {
    /**
     * Get all active subscription plans (public)
     */
    getActivePlans: async (): Promise<ApiResponse<SubscriptionPlanDto[]>> => {
        const response = await http.get<ApiResponse<SubscriptionPlanDto[]>>('/subscription-plans');
        return response as any;
    },

    /**
     * Get all subscription plans including inactive (admin only)
     */
    getAllPlans: async (): Promise<ApiResponse<SubscriptionPlanDto[]>> => {
        const response = await http.get<ApiResponse<SubscriptionPlanDto[]>>('/subscription-plans/all');
        return response as any;
    },

    /**
     * Get subscription plan by ID
     */
    getPlanById: async (id: string): Promise<ApiResponse<SubscriptionPlanDto>> => {
        const response = await http.get<ApiResponse<SubscriptionPlanDto>>(`/subscription-plans/${id}`);
        return response as any;
    },

    /**
     * Create a new subscription plan
     */
    createPlan: async (data: CreateSubscriptionPlanDto): Promise<ApiResponse<SubscriptionPlanDto>> => {
        const response = await http.post<ApiResponse<SubscriptionPlanDto>>('/subscription-plans', data);
        return response as any;
    },

    /**
     * Update an existing subscription plan
     */
    updatePlan: async (id: string, data: UpdateSubscriptionPlanDto): Promise<ApiResponse<SubscriptionPlanDto>> => {
        const response = await http.put<ApiResponse<SubscriptionPlanDto>>(`/subscription-plans/${id}`, data);
        return response as any;
    },

    /**
     * Toggle a subscription plan's active status
     */
    toggleActive: async (id: string): Promise<ApiResponse<boolean>> => {
        const response = await http.patch<ApiResponse<boolean>>(`/subscription-plans/${id}/toggle-active`);
        return response as any;
    },

    /**
     * Delete a subscription plan
     */
    deletePlan: async (id: string): Promise<ApiResponse<boolean>> => {
        const response = await http.delete<ApiResponse<boolean>>(`/subscription-plans/${id}`);
        return response as any;
    }
};
