"use client";

interface SpecialRequestsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SpecialRequestsInput({ value, onChange }: SpecialRequestsInputProps) {
  return (
    <div>
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Special Requests</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Any special requests or preferences? (Optional)"
        rows={4}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
      />
      <div className="text-xs text-gray-500 mt-2">
        E.g., early check-in, high floor, extra pillows, etc.
      </div>
    </div>
  );
}
