import { Building2, Globe, Phone, Mail, MapPin, FileText, Image, LayoutGrid } from '@repo/ui/icons';
import { Brand } from '@repo/types';

interface BrandFormProps {
  data: Partial<Brand>;
  onChange: (data: Partial<Brand>) => void;
  errors?: Record<string, string>;
}

export default function BrandForm({ data, onChange, errors = {} }: BrandFormProps) {
  const handleChange = (field: keyof Brand, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Brand Identity */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
          <Building2 size={16} /> Brand Identity
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Brand Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="e.g. Sunrise Hotels"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Description</label>
            <textarea
              value={data.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
              placeholder="Brief description of the brand..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block flex items-center gap-2"><Image size={14} /> Logo URL</label>
            <input
              type="text"
              value={data.logoUrl || ''}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block flex items-center gap-2"><Globe size={14} /> Website</label>
            <input
              type="text"
              value={data.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
          <Phone size={16} /> Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block flex items-center gap-2"><Mail size={14} /> Email Address</label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="contact@brand.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block flex items-center gap-2"><Phone size={14} /> Phone Number</label>
            <input
              type="text"
              value={data.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="+1 234..."
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
          <MapPin size={16} /> Headquarters Location
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Address</label>
            <input
              type="text"
              value={data.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="123 Business St"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">City</label>
              <input
                type="text"
                value={data.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="City"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Country</label>
              <input
                type="text"
                value={data.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="Country"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Postal Code</label>
              <input
                type="text"
                value={data.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="Zip Code"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
          <LayoutGrid size={16} /> Business Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Commission Rate (%)</label>
            <input
              type="text"
              value={data.commissionRate || ''}
              onChange={(e) => handleChange('commissionRate', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="e.g. 15"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
