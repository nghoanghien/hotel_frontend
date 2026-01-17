import { Brand, OnboardingSummary, OnboardingApplication, OnboardingStats, OnboardingStatus, DocumentStatus } from '@repo/types';

// Mock Data Generator
const generateMockBrands = (count: number): Brand[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `brand-${i + 1}`,
    name: `Brand ${i + 1} International`,
    description: 'A luxury hotel chain offering premium experiences.',
    logoUrl: `https://ui-avatars.com/api/?name=Brand+${i + 1}&background=random`,
    website: `https://brand${i + 1}.com`,
    phoneNumber: '+1 234 567 890',
    email: `contact@brand${i + 1}.com`,
    address: '123 Business Blvd',
    city: 'New York',
    country: 'USA',
    isActive: Math.random() > 0.1, // 90% active
    hotelCount: Math.floor(Math.random() * 50) + 1,
    commissionRate: '15%'
  }));
};

const generateMockOnboardingSummaries = (count: number): OnboardingSummary[] => {
  const statuses: OnboardingStatus[] = ['PendingReview', 'DocumentsRequired', 'Approved', 'Rejected', 'ChangesRequested'];
  return Array.from({ length: count }).map((_, i) => ({
    id: `app-${i + 1}`,
    hotelName: `Grand Hotel ${i + 1}`,
    brandName: `New Brand ${i + 1}`,
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    applicantName: `Applicant ${i + 1}`,
    applicantEmail: `applicant${i + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    totalRooms: Math.floor(Math.random() * 200) + 50,
    starRating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
    submittedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 2000000000)).toISOString()
  }));
};

// Service Implementation
export const brandPartnersService = {
  // Brand Management
  getAllBrands: async (): Promise<Brand[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockBrands(15);
  },

  getBrandById: async (id: string): Promise<Brand | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const brands = generateMockBrands(1);
    return { ...brands[0], id };
  },

  createBrand: async (brandData: Partial<Brand>): Promise<Brand> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: `brand-${Date.now()}`,
      isActive: true,
      hotelCount: 0,
      name: brandData.name || '',
      ...brandData
    } as Brand;
  },

  updateBrand: async (id: string, brandData: Partial<Brand>): Promise<Brand> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id,
      isActive: brandData.isActive !== undefined ? brandData.isActive : true,
      hotelCount: 5,
      name: brandData.name || 'Updated Brand',
      ...brandData
    } as Brand;
  },

  deleteBrand: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  // Onboarding Management
  getPendingApplications: async (): Promise<OnboardingSummary[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const all = generateMockOnboardingSummaries(20);
    return all.filter(a => a.status === 'PendingReview');
  },

  getAllApplications: async (status?: OnboardingStatus): Promise<OnboardingSummary[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const all = generateMockOnboardingSummaries(25);
    return status ? all.filter(a => a.status === status) : all;
  },

  getApplicationById: async (id: string): Promise<OnboardingApplication | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id,
      applicantId: 'user-123',
      applicantName: 'Nguyen Van A',
      applicantEmail: 'nguyenvana@example.com',
      brandName: 'Sunrise Hotels Group',
      brandDescription: 'Luxury seaside resorts.',
      hotelName: 'Sunrise Nha Trang',
      hotelDescription: 'A beautiful hotel by the beach with 5-star amenities.',
      address: 'Tran Phu Street',
      city: 'Nha Trang',
      state: 'Khanh Hoa',
      country: 'Vietnam',
      postalCode: '650000',
      starRating: 5,
      totalRooms: 150,
      contactName: 'Nguyen Van A',
      contactEmail: 'contact@sunrise.com',
      contactPhone: '0909123456',
      contactPosition: 'Owner',
      legalBusinessName: 'Sunrise Hospitality JSC',
      taxId: '0301234567',
      businessRegistrationNumber: '0301234567',
      selectedPlanId: 'plan-premium',
      selectedPlanName: 'Premium Plan',
      selectedBillingCycle: 'Yearly',
      status: 'PendingReview',
      documents: [
        {
          id: 'doc-1',
          type: 'BusinessLicense',
          fileName: 'BusinessLicense.pdf',
          fileUrl: '#',
          status: 'Pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 'doc-2',
          type: 'FireSafetyCertificate',
          fileName: 'FireSafety.pdf',
          fileUrl: '#',
          status: 'Approved',
          createdAt: new Date().toISOString()
        },
        {
          id: 'doc-3',
          type: 'TaxRegistration',
          fileName: 'TaxRegistration.pdf',
          fileUrl: '#',
          status: 'Pending',
          createdAt: new Date().toISOString()
        }
      ],
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString()
    } as OnboardingApplication;
  },

  approveApplication: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  },

  rejectApplication: async (id: string, reason: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  reviewApplication: async (id: string, newStatus: OnboardingStatus, notes?: string, rejectionReason?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  reviewDocument: async (docId: string, status: DocumentStatus): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  getStats: async (): Promise<OnboardingStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalApplications: 152,
      draftApplications: 45,
      pendingReview: 12,
      documentsRequired: 8,
      approvedThisMonth: 24,
      rejectedThisMonth: 3,
      activePartners: 89
    };
  }
};
