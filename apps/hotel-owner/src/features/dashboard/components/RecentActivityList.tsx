import { RecentActivity } from "@repo/types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { User, LogIn, LogOut, FileText, Activity } from "lucide-react";

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "booking":
        return <FileText size={18} strokeWidth={2.5} />;
      case "checkin":
        return <LogIn size={18} strokeWidth={2.5} />;
      case "checkout":
        return <LogOut size={18} strokeWidth={2.5} />;
      case "review":
        return <User size={18} strokeWidth={2.5} />;
      default:
        return <Activity size={18} strokeWidth={2.5} />;
    }
  };

  const getStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "booking":
        return "bg-blue-50 text-blue-600";
      case "checkin":
        return "bg-[var(--primary)]/10 text-[var(--primary)]";
      case "checkout":
        return "bg-[var(--danger)]/10 text-[var(--danger)]";
      case "review":
        return "bg-[var(--warning)]/10 text-[var(--warning)]";
      default:
        return "bg-gray-50 text-gray-600";
    }
  }

  return (
    <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-xl font-bold text-[#1A1A1A]">Recent Activities</h3>
      </div>

      <div className="space-y-6 pl-2">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-4 relative group">
            {/* Connector Line */}
            {index !== activities.length - 1 && (
              <div className="absolute top-10 left-[19px] w-[2px] h-[calc(100%+24px)] bg-gray-100 -z-10 group-hover:bg-gray-200 transition-colors" />
            )}

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getStyle(activity.type)} shadow-sm ring-4 ring-white`}>
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 pt-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                {activity.description}
              </p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: vi })}
                </span>
                {activity.roomNumber && (
                  <span className="text-xs text-gray-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    Phòng {activity.roomNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
