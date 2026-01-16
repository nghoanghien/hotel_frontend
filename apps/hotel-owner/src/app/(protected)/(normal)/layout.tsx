'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  User,
  LogOut,
  BedDouble,
  ConciergeBell,
  BarChart,
  Settings,
  DoorOpen
} from '@repo/ui/icons';
import { ChevronDown, ChevronRight } from 'lucide-react';
import RestaurantNavItem from '../../../components/RestaurantNavItem';
import { ProfileShimmer, NavItemShimmer, useSwipeConfirmation, useLoading } from '@repo/ui';
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useLogout } from "../../../features/auth/hooks/useLogout";

interface MenuItem {
  id: string;
  icon: any;
  text: string;
  title: string;
  children?: { id: string; text: string; path: string; icon: any }[];
}

const adminMenuItems: MenuItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, text: 'Tổng quan', title: 'OVERVIEW' },
  {
    id: 'rooms',
    icon: BedDouble,
    text: 'Quản lý phòng',
    title: 'ROOM MANAGEMENT',
    children: [
      { id: 'rooms-ops', text: 'Vận hành phòng', path: '/rooms', icon: DoorOpen },
      { id: 'rooms-settings', text: 'Cấu hình phòng', path: '/room-configuration', icon: Settings }
    ]
  },
  { id: 'reception', icon: ConciergeBell, text: 'Lễ tân', title: 'RECEPTION' },
  { id: 'hotel-info', icon: Building2, text: 'Thông tin khách sạn', title: 'HOTEL INFORMATION' },
  { id: 'staff', icon: Users, text: 'Quản lý nhân viên', title: 'STAFF MANAGEMENT' },
  { id: 'reports', icon: BarChart, text: 'Báo cáo', title: 'REPORTS' }
];

export default function NormalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('dashboard');

  const { user, isLoading } = useAuth();
  const { mutate: logout } = useLogout();

  const [navHovered, setNavHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const { confirm } = useSwipeConfirmation();
  const { show } = useLoading();

  // Update active section based on pathname
  useEffect(() => {
    const currentPath = pathname.split('/').pop();
    // Check if current path matches any top level item
    if (currentPath && adminMenuItems.some(item => item.id === currentPath)) {
      setActiveSection(currentPath);
    }
    // Check if current path matches any child item
    else {
      // Logic to find if we are in a sub-route (e.g. /rooms/settings)
      // This is a simplified check. Ideally we match against actual paths.
      for (const item of adminMenuItems) {
        if (item.children) {
          const childMatch = item.children.find(child => child.path === pathname || child.path.endsWith(`/${currentPath}`));
          if (childMatch) {
            setActiveSection(childMatch.id);
            // Auto expand the parent if a child is active
            setExpandedMenus(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
            return;
          }
        }
      }
      // Fallback for direct 'rooms' access which maps to 'rooms-ops' child visually but URL is /rooms
      if (pathname === '/rooms') {
        setActiveSection('rooms-ops');
        setExpandedMenus(prev => prev.includes('rooms') ? prev : [...prev, 'rooms']);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    // ... existing logout logic ...
    confirm({
      title: "Xác nhận đăng xuất",
      description: "Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?",
      confirmText: "Vuốt để đăng xuất",
      type: "danger",
      onConfirm: async () => {
        show("Đang đăng xuất...");
        logout();
      }
    });
  };

  const handleSectionChange = (item: MenuItem) => {
    // If item has children, toggle expansion
    if (item.children) {
      setExpandedMenus(prev =>
        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
      );
      // Optional: Navigate to the first child if clicking parent? Or just toggle?
      // User said "click vào sẽ hiển thị các tab con", so toggle is primary. 
      return;
    }

    // Normal navigation
    setActiveSection(item.id);
    router.push(`/${item.id}`);
  };

  const handleChildClick = (path: string, id: string) => {
    setActiveSection(id);
    router.push(path);
  }

  // ... rest of component ...
  const handleProfileClick = () => {
    router.push('/profile');
  };

  const activeItem = adminMenuItems.find(item => item.id === activeSection) ||
    adminMenuItems.flatMap(i => i.children || []).find(c => c.id === activeSection) ||
    adminMenuItems[0];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div
        className={`nav-container liquid-glass-container flex rounded-3xl flex-col transition-all duration-500 ease-out backdrop-blur-sm shadow-2xl ${navHovered ? "w-72 bottom-6 top-6" : "w-20 bottom-24 top-24"
          } fixed left-6 z-50 overflow-hidden`}
        style={{
          background: navHovered
            ? "linear-gradient(135deg, rgba(120, 200, 65, 0.15) 0%, rgba(180, 229, 13, 0.1) 50%, rgba(120, 200, 65, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(120, 200, 65, 0.2) 0%, rgba(180, 229, 13, 0.15) 100%)",
          boxShadow: navHovered
            ? "0 25px 45px rgba(0, 0, 0, 0.15), 0 0 80px rgba(120, 200, 65, 0.1)"
            : "0 15px 25px -10px rgba(0,0,0,0.12), 0 0 20px -10px rgba(120,200,65,0.08)",
        }}
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      >
        {/* Animated liquid background */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-700"
          style={{
            background: `
                radial-gradient(circle at 20% 20%, rgba(120, 200, 65, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(180, 229, 13, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(120, 200, 65, 0.1) 0%, transparent 50%)
              `,
            filter: "blur(1px)",
            transform: navHovered ? "scale(1.1) rotate(2deg)" : "scale(1)",
            transition: "transform 0.8s ease-out",
          }}
        />

        {/* Profile section */}
        {isLoading ? (
          <ProfileShimmer expanded={navHovered} />
        ) : (
          <motion.div
            className="profile-section relative flex items-center p-6 border-b border-white/30 cursor-pointer group transition-all duration-300 liquid-glass-nav-item shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.1)]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
            }}
            onClick={handleProfileClick}
            layoutId="profile-section"
          >
            {/* Profile content stays same */}
            <div
              className="absolute inset-0 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(120, 200, 65, 0.1) 100%)",
                backdropFilter: "blur(10px)",
              }}
            />

            {navHovered ? (
              <>
                <motion.div
                  className="relative h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.3)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                  layoutId="profile-avatar"
                >
                  <User size={22} className="text-gray-700 drop-shadow-sm" />
                </motion.div>
                <div className="relative ml-4">
                  <motion.p
                    layoutId="profile-name"
                    className="font-semibold text-sm text-gray-800 tracking-wide drop-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Admin'}
                  </motion.p>
                  <motion.p
                    layoutId="profile-email"
                    className="text-xs text-gray-600 drop-shadow-sm tracking-wide whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {user?.email || 'admin@hotel.com'}
                  </motion.p>
                </div>
              </>
            ) : (
              <motion.div
                className="relative h-12 w-12 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.3)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <User size={22} className="text-gray-700 drop-shadow-sm" />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Navigation items */}
        <div className="relative flex-1 py-6 px-3 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className={`mb-4 ${navHovered ? "px-4" : "text-center"}`}>
            <p className="text-xs text-gray-600 uppercase font-medium mb-3 drop-shadow-sm whitespace-nowrap overflow-hidden tracking-wider">
              {navHovered ? "Quản trị hệ thống" : "QT"}
            </p>
          </div>

          {isLoading ? (
            Array.from({ length: adminMenuItems.length }, (_, index) => (
              <NavItemShimmer
                key={`shimmer-${index}`}
                expanded={navHovered}
                index={index}
              />
            ))
          ) : (
            adminMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isExpanded = expandedMenus.includes(item.id);
              const hasChildren = item.children && item.children.length > 0;
              // Active if explicit match or child active (handled by useEffect logic but visual here)
              const isActive = activeSection === item.id || (item.children?.some(c => c.id === activeSection) ?? false);

              return (
                <div key={item.id} className="flex flex-col relative">
                  <div className="relative z-10">
                    <RestaurantNavItem
                      key={item.id}
                      icon={
                        <IconComponent
                          size={20}
                          className="text-gray-600"
                          strokeWidth={2.3}
                        />
                      }
                      text={item.text}
                      expanded={navHovered}
                      active={isActive && !hasChildren} // only active highlight if it's a leaf or specific strict match? Maybe highlight parent too? standard is highlight parent.
                      // Let's rely on standard styling but keep parent generic if expanded.
                      className={`${isActive ? "bg-white/10" : ""}`}
                      onClick={() => handleSectionChange(item)}
                    />
                    {/* Toggle Icon for Parents - Thicker and Bigger */}
                    {hasChildren && navHovered && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                        {isExpanded ? <ChevronDown size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
                      </div>
                    )}
                  </div>

                  {/* Children Items with Tree Line */}
                  <AnimatePresence>
                    {hasChildren && isExpanded && navHovered && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="relative ml-[37px] space-y-1 my-1">
                          {/* Vertical Tree Line */}
                          <div className="absolute rounded-full left-[-12px] top-0 bottom-2.5 w-[2.5px] bg-gray-400"></div>

                          {item.children!.map((child, idx) => {
                            const ChildIcon = child.icon;
                            return (
                              <div key={child.id} className="relative">
                                {/* Horizontal Connector */}
                                <div className="absolute rounded-full left-[-12px] top-[24px] w-3 h-[2.5px] bg-gray-400"></div>

                                <RestaurantNavItem
                                  icon={
                                    <ChildIcon
                                      size={18}
                                      className="text-gray-500"
                                      strokeWidth={2.3}
                                    />
                                  }
                                  text={child.text}
                                  expanded={true} // Always expanded in this view context
                                  active={activeSection === child.id}
                                  onClick={() => handleChildClick(child.path, child.id)}
                                  className="!py-2 !px-3" // Slightly compact
                                />
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom section - Logout */}
        <div
          className="relative p-4 border-t border-white/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
          }}
        >
          {isLoading ? (
            <NavItemShimmer
              expanded={navHovered}
              index={adminMenuItems.length}
            />
          ) : (
            <RestaurantNavItem
              icon={
                <LogOut size={20} className="text-gray-600" strokeWidth={2.3} />
              }
              text="Đăng xuất"
              expanded={navHovered}
              active={false}
              onClick={handleLogout}
              className="logout-item"
            />
          )}
        </div>
      </div >

      <div className="flex-1 ml-28 flex flex-col">
        {/* Header */}


        {/* Page Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div >
  );
}
