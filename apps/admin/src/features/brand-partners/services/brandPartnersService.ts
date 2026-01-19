import { Brand, OnboardingSummary, OnboardingApplication, OnboardingStats, OnboardingStatus, DocumentStatus } from '@repo/types';
import { getAllBrands } from '@repo/mock-data';

// Use brands from shared mock-data to ensure consistency
const SHARED_BRANDS = getAllBrands();

// Transform BrandDto to Brand type (add missing fields for admin view)
const initialBrands: Brand[] = SHARED_BRANDS.map(brand => ({
  ...brand,
  address: brand.city === 'Hồ Chí Minh' ? 'Vinpearl Tower, 72 Le Thanh Ton' :
    brand.city === 'Đà Nẵng' ? '105 Vo Nguyen Giap' :
      brand.city === 'Hà Nội' ? '141 Nguyen Luong Bang' : '',
  commissionRate: brand.name === 'Vinpearl' ? '15%' :
    brand.name === 'Melia Hotels' ? '18%' :
      brand.name === 'Mường Thanh' ? '15%' : '15%'
}));

// MUTABLE ARRAYS for CRUD operations
let _brandsData: Brand[] = [...initialBrands];

// Static onboarding applications
const initialApplications: OnboardingSummary[] = [
  {
    id: 'app-001',
    hotelName: 'Sunrise Beach Resort',
    brandName: 'Sunrise Hospitality Group',
    city: 'Da Nang',
    country: 'Vietnam',
    applicantName: 'Trần Văn Minh',
    applicantEmail: 'minh.tran@sunriseresort.vn',
    status: 'PendingReview',
    totalRooms: 180,
    starRating: 5,
    submittedAt: '2026-01-18T10:30:00.000Z',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'app-002',
    hotelName: 'Golden Star Hotel',
    brandName: 'Golden Chain Hotels',
    city: 'Hanoi',
    country: 'Vietnam',
    applicantName: 'Nguyễn Thị Lan',
    applicantEmail: 'lan.nguyen@goldenstar.vn',
    status: 'DocumentsRequired',
    totalRooms: 120,
    starRating: 4,
    submittedAt: '2026-01-17T14:20:00.000Z',
    createdAt: '2026-01-10T09:30:00.000Z'
  },
  {
    id: 'app-003',
    hotelName: 'Ocean View Suites',
    brandName: 'Pacific Hotels',
    city: 'Vung Tau',
    country: 'Vietnam',
    applicantName: 'Lê Hoàng Nam',
    applicantEmail: 'nam.le@oceanview.vn',
    status: 'Approved',
    totalRooms: 95,
    starRating: 4,
    submittedAt: '2026-01-10T11:15:00.000Z',
    createdAt: '2026-01-05T10:00:00.000Z'
  },
  {
    id: 'app-004',
    hotelName: 'Mountain Retreat Lodge',
    brandName: 'Highland Resorts',
    city: 'Da Lat',
    country: 'Vietnam',
    applicantName: 'Phạm Minh Tuấn',
    applicantEmail: 'tuan.pham@mountainretreat.vn',
    status: 'ChangesRequested',
    totalRooms: 65,
    starRating: 3,
    submittedAt: '2026-01-16T09:45:00.000Z',
    createdAt: '2026-01-12T14:20:00.000Z'
  },
  {
    id: 'app-005',
    hotelName: 'City Center Plaza',
    brandName: 'Urban Hotels Group',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    applicantName: 'Võ Thị Hoa',
    applicantEmail: 'hoa.vo@citycenter.vn',
    status: 'Rejected',
    totalRooms: 150,
    starRating: 4,
    submittedAt: '2025-12-28T13:00:00.000Z',
    createdAt: '2025-12-20T08:30:00.000Z'
  },
  {
    id: 'app-006',
    hotelName: 'Riverside Boutique Hotel',
    brandName: 'Boutique Collection',
    city: 'Hoi An',
    country: 'Vietnam',
    applicantName: 'Đỗ Văn Hùng',
    applicantEmail: 'hung.do@riverside.vn',
    status: 'PendingReview',
    totalRooms: 45,
    starRating: 4,
    submittedAt: '2026-01-19T08:30:00.000Z',
    createdAt: '2026-01-16T11:00:00.000Z'
  }
];

// MUTABLE ARRAY for applications
let _applicationsData: OnboardingSummary[] = [...initialApplications];

// Service Implementation with REAL CRUD
export const brandPartnersService = {
  // Brand Management
  getAllBrands: async (): Promise<Brand[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [..._brandsData];
  },

  getBrandById: async (id: string): Promise<Brand | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return _brandsData.find(b => b.id === id) || null;
  },

  createBrand: async (brandData: Partial<Brand>): Promise<Brand> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      isActive: true,
      hotelCount: 0,
      name: brandData.name || '',
      description: brandData.description || '',
      email: brandData.email || '',
      phoneNumber: brandData.phoneNumber || '',
      city: brandData.city || '',
      country: brandData.country || 'Vietnam',
      commissionRate: brandData.commissionRate || '15%',
      ...brandData
    } as Brand;

    _brandsData.unshift(newBrand); // Add to start
    return newBrand;
  },

  updateBrand: async (id: string, brandData: Partial<Brand>): Promise<Brand> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = _brandsData.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Brand not found');

    const updated: Brand = {
      ..._brandsData[index],
      ...brandData,
      id
    };

    _brandsData[index] = updated; // Update in place
    return updated;
  },

  deleteBrand: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = _brandsData.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Brand not found');

    _brandsData.splice(index, 1); // Remove from array
    return true;
  },

  // Onboarding Management
  getPendingApplications: async (): Promise<OnboardingSummary[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return _applicationsData.filter(a => a.status === 'PendingReview');
  },

  getAllApplications: async (status?: OnboardingStatus): Promise<OnboardingSummary[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return status ? _applicationsData.filter(a => a.status === status) : [..._applicationsData];
  },

  getApplicationById: async (id: string): Promise<OnboardingApplication | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const summary = _applicationsData.find(a => a.id === id);
    if (!summary) return null;

    return {
      ...summary,
      applicantId: `user-${id}`,
      brandDescription: 'Comprehensive hotel brand details...',
      hotelDescription: `${summary.hotelName} is a premier property located in ${summary.city}.`,
      address: '123 Main Street',
      state: summary.city,
      postalCode: '700000',
      contactName: summary.applicantName,
      contactEmail: summary.applicantEmail,
      contactPhone: '+84-909-123-456',
      contactPosition: 'General Manager',
      legalBusinessName: `${summary.brandName} JSC`,
      taxId: '0301234567',
      businessRegistrationNumber: '0301234567-001',
      selectedPlanId: 'plan-premium',
      selectedPlanName: 'Premium Plan',
      selectedBillingCycle: 'Yearly',
      documents: [
        {
          id: `doc-${id}-1`,
          type: 'BusinessLicense',
          fileName: 'BusinessLicense.pdf',
          fileUrl: '#',
          status: summary.status === 'DocumentsRequired' ? 'Pending' : 'Approved',
          createdAt: summary.createdAt
        },
        {
          id: `doc-${id}-2`,
          type: 'FireSafetyCertificate',
          fileName: 'FireSafety.pdf',
          fileUrl: '#',
          status: 'Approved',
          createdAt: summary.createdAt
        },
        {
          id: `doc-${id}-3`,
          type: 'TaxRegistration',
          fileName: 'TaxRegistration.pdf',
          fileUrl: '#',
          status: summary.status === 'DocumentsRequired' ? 'Rejected' : 'Pending',
          createdAt: summary.createdAt
        }
      ],
      updatedAt: new Date().toISOString()
    } as OnboardingApplication;
  },

  approveApplication: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const index = _applicationsData.findIndex(a => a.id === id);
    if (index === -1) return false;

    const application = _applicationsData[index];

    // UPDATE application status
    _applicationsData[index] = {
      ...application,
      status: 'Approved'
    };

    // CREATE new brand from application
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: application.brandName,
      description: `${application.brandName} - ${application.hotelName} property`,
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(application.brandName)}&background=random`,
      website: `https://${application.brandName.toLowerCase().replace(/\s+/g, '')}.com`,
      email: application.applicantEmail,
      phoneNumber: '+84-909-123-456',
      address: application.city,
      city: application.city,
      country: application.country,
      isActive: true,
      hotelCount: 1,
      commissionRate: '15%'
    };

    // ADD to brands list
    _brandsData.unshift(newBrand);

    return true;
  },

  rejectApplication: async (id: string, reason: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = _applicationsData.findIndex(a => a.id === id);
    if (index === -1) return false;

    _applicationsData[index] = {
      ..._applicationsData[index],
      status: 'Rejected'
    };
    return true;
  },

  reviewApplication: async (id: string, newStatus: OnboardingStatus, notes?: string, rejectionReason?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = _applicationsData.findIndex(a => a.id === id);
    if (index === -1) return false;

    _applicationsData[index] = {
      ..._applicationsData[index],
      status: newStatus
    };
    return true;
  },

  reviewDocument: async (docId: string, status: DocumentStatus): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  getStats: async (): Promise<OnboardingStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      pending: _applicationsData.filter(a => a.status === 'PendingReview').length,
      approved: _applicationsData.filter(a => a.status === 'Approved').length,
      rejected: _applicationsData.filter(a => a.status === 'Rejected').length
    };
  },

  // Reset function
  resetData: () => {
    _brandsData = [...initialBrands];
    _applicationsData = [...initialApplications];
  }
};
