export enum SubscriptionPlanType {
    Basic = 0,
    Standard = 1,
    Premium = 2,
    Enterprise = 3
}

export enum SubscriptionStatus {
    Trial = 0,
    Active = 1,
    PastDue = 2,
    Cancelled = 3,
    Expired = 4,
    Suspended = 5
}

export enum SubscriptionBillingCycle {
    Monthly = 0,
    Quarterly = 1,
    Yearly = 2
}

export enum InvoiceStatus {
    Draft = 0,
    Pending = 1,
    Paid = 2,
    Overdue = 3,
    Cancelled = 4
}

export interface SubscriptionPlanDto {
    id: string;
    name: string;
    description?: string;
    planType: SubscriptionPlanType;
    monthlyPrice: number;
    quarterlyPrice: number;
    yearlyPrice: number;
    currency: string;
    maxHotels: number;
    maxRoomsPerHotel: number;
    maxUsersPerHotel: number;
    commissionRate: number;
    isActive: boolean;
    isPopular: boolean;
    sortOrder: number;
}

export interface CreateSubscriptionPlanDto {
    name: string;
    description?: string;
    planType: SubscriptionPlanType;
    monthlyPrice: number;
    quarterlyPrice: number;
    yearlyPrice: number;
    currency: string;
    maxHotels: number;
    maxRoomsPerHotel: number;
    maxUsersPerHotel: number;
    commissionRate: number;
    isPopular: boolean;
    sortOrder: number;
}

export interface UpdateSubscriptionPlanDto {
    name?: string;
    description?: string;
    monthlyPrice?: number;
    quarterlyPrice?: number;
    yearlyPrice?: number;
    maxHotels?: number;
    maxRoomsPerHotel?: number;
    maxUsersPerHotel?: number;
    commissionRate?: number;
    isActive?: boolean;
    isPopular?: boolean;
    sortOrder?: number;
}

export interface SubscriptionDto {
    id: string;
    brandId: string;
    brandName: string;
    planId: string;
    planName: string;
    planType: SubscriptionPlanType;
    status: SubscriptionStatus;
    billingCycle: SubscriptionBillingCycle;
    startDate: string;
    endDate: string;
    trialEndDate?: string;
    price: number;
    discountPercentage: number;
    currency: string;
    autoRenew: boolean;
    nextBillingDate?: string;
    createdAt: string;
}

export interface SubscriptionInvoiceDto {
    id: string;
    subscriptionId: string;
    invoiceNumber: string;
    periodStart: string;
    periodEnd: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    status: InvoiceStatus;
    paidAt?: string;
    dueDate: string;
    invoicePdfUrl?: string;
    createdAt: string;
}

export interface ChangeSubscriptionPlanDto {
    newPlanId: string;
    newBillingCycle?: SubscriptionBillingCycle;
}
