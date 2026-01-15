import { Switch as HeadlessSwitch } from '@headlessui/react';
import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export default function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <HeadlessSwitch.Group>
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col mr-4">
          {label && <HeadlessSwitch.Label className="text-sm font-bold text-gray-900 cursor-pointer">{label}</HeadlessSwitch.Label>}
          {description && <HeadlessSwitch.Description className="text-xs text-gray-500 mt-1">{description}</HeadlessSwitch.Description>}
        </div>
        <HeadlessSwitch
          checked={checked}
          onChange={onChange}
          className={`${checked ? 'bg-[#1A1A1A]' : 'bg-gray-200'
            } relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2`}
        >
          <span
            className={`${checked ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
          />
        </HeadlessSwitch>
      </div>
    </HeadlessSwitch.Group>
  );
}
