import { useState, useMemo, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { DataTable, ColumnDef, useNotification, useSwipeConfirmation } from '@repo/ui';
import { Search, Edit, Lock, Unlock, Zap, Shield, Rocket, Building } from '@repo/ui/icons';
import { SubscriptionPlanDto, SubscriptionPlanType } from '@repo/types';
import { subscriptionPlanService } from '../services/subscriptionPlanService';
import EditPlanModal from './EditPlanModal';

// Helper to get type label
const getTypeLabel = (type: SubscriptionPlanType): string => {
    const labels: Record<SubscriptionPlanType, string> = {
        [SubscriptionPlanType.Basic]: 'Basic',
        [SubscriptionPlanType.Standard]: 'Standard',
        [SubscriptionPlanType.Premium]: 'Premium',
        [SubscriptionPlanType.Enterprise]: 'Enterprise',
    };
    return labels[type];
};

// Helper to get type color and icon
const getTypeMeta = (type: SubscriptionPlanType) => {
    const meta: Record<SubscriptionPlanType, { color: string, icon: any }> = {
        [SubscriptionPlanType.Basic]: { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: Zap },
        [SubscriptionPlanType.Standard]: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Rocket },
        [SubscriptionPlanType.Premium]: { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Shield },
        [SubscriptionPlanType.Enterprise]: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Building },
    };
    return meta[type];
};

const columns: ColumnDef<SubscriptionPlanDto>[] = [
    {
        label: 'PLAN NAME',
        key: 'name',
        className: 'min-w-[250px]',
        formatter: (_: any, item: SubscriptionPlanDto) => {
            const { color, icon: IconComp } = getTypeMeta(item.planType);
            return (
                <div className="flex items-center gap-4 group">
                    <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shadow-sm border`}>
                            <IconComp size={20} className="shrink-0" strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-lime-700 transition-colors text-[13px] leading-tight flex items-center gap-2">
                            {item.name}
                            {item.isPopular && (
                                <span className="px-1.5 py-0.5 rounded-md bg-lime-100 text-lime-700 text-[9px] font-black uppercase tracking-tighter">POPULAR</span>
                            )}
                        </span>
                        {item.description && (
                            <span className="text-[11px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                                {item.description}
                            </span>
                        )}
                    </div>
                </div>
            );
        }
    },
    {
        label: 'MONTHLY PRICE',
        key: 'monthlyPrice',
        className: 'min-w-[150px]',
        formatter: (val: number, item: SubscriptionPlanDto) => (
            <div className="flex flex-col">
                <span className="font-anton text-gray-900 text-sm">{val.toLocaleString()} {item.currency}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PER MONTH</span>
            </div>
        )
    },
    {
        label: 'LIMITS',
        key: 'maxHotels',
        className: 'min-w-[180px]',
        formatter: (_: any, item: SubscriptionPlanDto) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span className="uppercase tracking-widest text-[9px]">Hotels:</span>
                    <span className="text-gray-900">{item.maxHotels}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span className="uppercase tracking-widest text-[9px]">Rooms/KS:</span>
                    <span className="text-gray-900">{item.maxRoomsPerHotel}</span>
                </div>
            </div>
        )
    },
    {
        label: 'COMMISSION',
        key: 'commissionRate',
        className: 'min-w-[120px] text-center',
        formatter: (val: number) => (
            <div className="inline-flex items-center justify-center px-3 py-1 bg-lime-50 rounded-lg border border-lime-100 font-anton text-lime-700 text-sm">
                {val}%
            </div>
        )
    },
    {
        label: 'STATUS',
        key: 'isActive',
        className: 'min-w-[120px] text-center',
        formatter: (_: any, item: SubscriptionPlanDto) => (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${item.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {item.isActive ? 'ACTIVE' : 'INACTIVE'}
            </div>
        )
    }
];

interface SubscriptionPlanListProps {
    refreshTrigger?: number;
}

export default function SubscriptionPlanList({ refreshTrigger = 0 }: SubscriptionPlanListProps) {
    const [data, setData] = useState<SubscriptionPlanDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();
    const { confirm } = useSwipeConfirmation();
    const [sortConfig, setSortConfig] = useState<{ key: keyof SubscriptionPlanDto; direction: 'asc' | 'desc' } | null>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [selectedPlanEdit, setSelectedPlanEdit] = useState<SubscriptionPlanDto | null>(null);

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await subscriptionPlanService.getAllPlans();
            if (res.success) {
                setData(res.data || []);
            }
        } catch (e) {
            showNotification({ message: 'Failed to load subscription plans', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSort = (key: string) => {
        const typedKey = key as keyof SubscriptionPlanDto;
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === typedKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: typedKey, direction });
    };

    const handleToggleStatus = (plan: SubscriptionPlanDto) => {
        const isDeactivating = plan.isActive;
        confirm({
            title: isDeactivating ? 'Deactivate Plan?' : 'Activate Plan?',
            description: isDeactivating
                ? `Deactivating "${plan.name}" will prevent new brands from subscribing to it.`
                : `Activating "${plan.name}" will make it available for new subscriptions.`,
            confirmText: isDeactivating ? 'SWIPE TO DEACTIVATE' : 'SWIPE TO ACTIVATE',
            type: isDeactivating ? 'danger' : 'success',
            onConfirm: async () => {
                try {
                    await subscriptionPlanService.toggleActive(plan.id);
                    showNotification({ message: `Plan ${isDeactivating ? 'deactivated' : 'activated'} successfully`, type: 'success' });
                    loadData();
                } catch (e) {
                    showNotification({ message: 'Failed to update plan status', type: 'error' });
                }
            }
        });
    };

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        // Search
        if (searchQuery) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = (a[sortConfig!.key] as any) || '';
                const bVal = (b[sortConfig!.key] as any) || '';
                if (aVal < bVal) return sortConfig!.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig!.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            // Default sort by order
            result.sort((a, b) => a.sortOrder - b.sortOrder);
        }

        return result;
    }, [data, searchQuery, sortConfig]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full"
        >
            {/* Header with Actions */}
            <div className="pb-4 p-8 border-b border-gray-50 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
                        <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Subscription Tiers</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-400 pl-3.5">Configure platform plans, pricing and limitations</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search plans..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lime-200 focus:bg-white transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
                    </div>
                ) : (
                    <DataTable<SubscriptionPlanDto>
                        data={filteredAndSortedData}
                        columns={columns}
                        handleSort={handleSort}
                        sortField={sortConfig?.key}
                        sortDirection={sortConfig?.direction}
                        renderActions={(item) => (
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); setSelectedPlanEdit(item); }}
                                    className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm transition-colors"
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.92 }}
                                    title="Edit Plan"
                                >
                                    <Edit size={18} />
                                </motion.button>

                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(item); }}
                                    className={`p-2 rounded-xl shadow-sm transition-colors ${item.isActive
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                        }`}
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.92 }}
                                    title={item.isActive ? "Deactivate" : "Activate"}
                                >
                                    {item.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                                </motion.button>
                            </div>
                        )}
                        onRowClick={(item) => setSelectedPlanEdit(item)}
                        headerClassName="bg-gray-100 text-gray-900 border-none rounded-xl py-4 mb-2"
                        headerCellClassName="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors"
                        tableContainerClassName="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                        rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
                    />
                )}
            </div>

            {/* Modals placeholders */}
            <EditPlanModal
                isOpen={!!selectedPlanEdit}
                plan={selectedPlanEdit}
                onClose={() => setSelectedPlanEdit(null)}
                onSuccess={loadData}
            />
        </motion.div>
    );
}
