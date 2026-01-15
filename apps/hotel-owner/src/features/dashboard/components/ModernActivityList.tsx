import { RecentActivity } from "@repo/types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Building2, Calendar, DollarSign, Users } from "lucide-react";

interface ModernActivityListProps {
  activities: RecentActivity[];
}

export function ModernActivityList({ activities }: ModernActivityListProps) {

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'booking': return Calendar;
      case 'hotel': return Building2;
      case 'user': return Users;
      default: return DollarSign;
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-[#1A1A1A]">Recent Activity</h3>
        <button className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">See all</button>
      </div>

      <div className="flex flex-col gap-6">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 line-clamp-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {activity.roomNumber ? `Room ${activity.roomNumber}` : activity.type}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-sm text-gray-900">
                  {/* Mock amount if not present, or just status */}
                  {activity.type === 'Booking' ? '-' : '+'}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  {formatDistanceToNow(new Date(activity.timestamp), { locale: vi })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
