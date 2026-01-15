"use client";

interface GuestInfoFormProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestNationality?: string;
  guestAddress?: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onNationalityChange?: (value: string) => void;
  onAddressChange?: (value: string) => void;
}

export default function GuestInfoForm({
  guestName,
  guestEmail,
  guestPhone,
  guestNationality = "",
  guestAddress = "",
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onNationalityChange,
  onAddressChange,
}: GuestInfoFormProps) {
  return (
    <div>
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Guest Information</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={guestPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+84 123 456 789"
            className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
          />
        </div>
        {onNationalityChange && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            <input
              type="text"
              value={guestNationality}
              onChange={(e) => onNationalityChange(e.target.value)}
              placeholder="Vietnamese"
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
            />
          </div>
        )}
        {onAddressChange && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={guestAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="123 Street, City"
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
}
