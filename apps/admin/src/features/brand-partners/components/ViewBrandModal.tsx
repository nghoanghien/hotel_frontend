import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from '@repo/ui/motion';
import { X, Building2, MapPin, Globe, Phone, Mail, Star, ShieldCheck } from '@repo/ui/icons';
import { Brand } from '@repo/types';

interface ViewBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
}

export default function ViewBrandModal({ isOpen, onClose, brand }: ViewBrandModalProps) {
  const [brokenLogo, setBrokenLogo] = useState(false);

  useEffect(() => {
    setBrokenLogo(false);
  }, [brand?.id]);

  if (typeof document === 'undefined') return null;

  const showPlaceholder = !brand?.logoUrl || brand.logoUrl.trim().length === 0 || brand.logoUrl.includes('ui-avatars') || brokenLogo;

  return (
    <AnimatePresence>
      {isOpen && brand && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-3xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
            >
              {/* Header Area */}
              <div className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                  {/* Logo or Placeholder */}
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shadow-sm shrink-0">
                    {!showPlaceholder ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        onError={() => setBrokenLogo(true)}
                        className="w-full h-full object-cover rounded-xl bg-white"
                      />
                    ) : (
                      <Building2 size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-anton text-[#1A1A1A] uppercase tracking-wide leading-none">{brand.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border ${brand.isActive ? 'bg-lime-50 text-lime-700 border-lime-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {brand.isActive ? 'Active Partner' : 'Suspended'}
                      </span>
                      <div className="w-px h-4 bg-gray-200" />
                      <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" /> {brand.city ? `${brand.city}, ${brand.country}` : 'Unknown Location'}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="space-y-8">
                  {/* Description */}
                  <Section title="Brand Overview">
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                      <p className="text-gray-600 text-base leading-relaxed font-medium">
                        {brand.description || 'No description provided for this brand partner.'}
                      </p>
                    </div>
                  </Section>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1A1A1A] p-6 rounded-[24px] text-white flex items-center justify-between shadow-lg shadow-gray-200">
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Hotels</div>
                        <div className="text-4xl font-anton">{brand.hotelCount}</div>
                      </div>
                      <Building2 size={32} className="text-lime-400 opacity-80" />
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Commission Rate</div>
                        <div className="text-4xl font-anton text-[#1A1A1A]">
                          {brand.commissionRate ? `${brand.commissionRate}%` : '0%'}
                        </div>
                      </div>
                      <Star size={32} className="text-yellow-400" />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <Section title="Contact & Digital Presence">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard icon={Globe} label="Website" value={brand.website} isLink />
                      <InfoCard icon={Mail} label="Contact Email" value={brand.email} isLink prefix="mailto:" />
                      <InfoCard icon={Phone} label="Phone Number" value={brand.phoneNumber} />
                      <InfoCard icon={ShieldCheck} label="Tax ID" value="TAX-8829-192" /> {/* Mock tax id wrapper if needed */}
                    </div>
                  </Section>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-1">
        {title}
      </h4>
      {children}
    </div>
  )
}

function InfoCard({ icon: Icon, label, value, isLink, prefix = '' }: any) {
  if (!value) return null;
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="p-3 bg-gray-50 text-gray-500 rounded-xl shrink-0">
        <Icon size={20} />
      </div>
      <div className="overflow-hidden">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
        {isLink ? (
          <a href={`${prefix}${value}`} target="_blank" className="font-bold text-gray-900 text-sm hover:text-lime-600 truncate block transition-colors footer-link">
            {value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <div className="font-bold text-gray-900 text-sm truncate">{value}</div>
        )}
      </div>
    </div>
  )
}
