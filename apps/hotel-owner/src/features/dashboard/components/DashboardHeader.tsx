import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi });

  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-anton tracking-wide">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100/50 text-sm font-medium text-gray-600">
        Today: <span className="text-primary font-bold ml-1">{currentDate}</span>
      </div>
    </div>
  );
}
