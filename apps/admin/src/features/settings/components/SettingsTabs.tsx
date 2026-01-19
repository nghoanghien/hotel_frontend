import { motion } from '@repo/ui/motion';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface SettingsTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function SettingsTabs({ tabs, activeTab, onTabChange }: SettingsTabsProps) {
    return (
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              relative px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300
              ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
            `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTabSettings"
                                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon}
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
