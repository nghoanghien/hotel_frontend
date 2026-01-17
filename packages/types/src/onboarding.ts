export type OnboardingStatus =
  | 'Draft'
  | 'PendingReview'
  | 'DocumentsRequired'
  | 'ChangesRequested'
  | 'Approved'
  | 'Rejected';

export type BillingCycle = 'Monthly' | 'Yearly';

export type DocumentType =
  | 'BusinessLicense'
  | 'TaxRegistration'
  | 'OwnerIdentification'
  | 'FireSafetyCertificate'
  | 'Other';

export type DocumentStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected';

export type OnboardingDocument = {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  status: DocumentStatus;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  expiryDate?: string;
  createdAt: string;
};

export type OnboardingApplication = {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;

  // Brand
  existingBrandId?: string;
  brandName: string;
  brandDescription?: string;
  brandLogoUrl?: string;
  brandWebsite?: string;

  // Hotel
  hotelName: string;
  hotelDescription?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  starRating: number;
  totalRooms: number;
  numberOfFloors?: number;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactPosition?: string;

  // Business
  legalBusinessName: string;
  taxId?: string;
  businessRegistrationNumber?: string;

  // Subscription
  selectedPlanId?: string;
  selectedPlanName?: string;
  selectedBillingCycle?: BillingCycle;

  // Status
  status: OnboardingStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  approvedAt?: string;

  // Created entities
  createdBrandId?: string;
  createdHotelId?: string;
  createdSubscriptionId?: string;

  documents: OnboardingDocument[];

  createdAt: string;
  updatedAt: string;
};

// Summary DTO for table view
export type OnboardingSummary = {
  id: string;
  hotelName: string;
  brandName: string;
  city: string;
  country: string;
  applicantName: string;
  applicantEmail: string;
  status: OnboardingStatus;
  totalRooms: number;
  starRating: number;
  submittedAt?: string;
  createdAt: string;
};

export type OnboardingStats = {
  totalApplications: number;
  draftApplications: number;
  pendingReview: number;
  documentsRequired: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  activePartners: number;
};
