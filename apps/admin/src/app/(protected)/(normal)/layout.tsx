'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from '@repo/ui/motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  Database,
  User,
  LogOut,
  Settings
} from '@repo/ui/icons';
import RestaurantNavItem from '../../../components/RestaurantNavItem';
import { ProfileShimmer, NavItemShimmer, useSwipeConfirmation, useLoading } from '@repo/ui';

// Updated menu structure mapping to existing routes where possible
// hotels -> Partners, customers -> Users, settings -> Master Data
const adminMenuItems = [
  { id: 'dashboard', icon: LayoutDashboard, text: 'Tổng quan', title: 'OVERVIEW' },
  { id: 'brand-partners', icon: Building2, text: 'Quản lý đối tác', title: 'PARTNER MANAGEMENT' },
  { id: 'users', icon: Users, text: 'Quản trị người dùng', title: 'USER MANAGEMENT' },
  { id: 'settings', icon: Settings, text: 'Master Data', title: 'MASTER DATA' }
];

export default function NormalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('overview');
  const [profileData] = useState({ fullName: 'Super Admin', email: 'admin@hotel.com' });
  const [navHovered, setNavHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { confirm } = useSwipeConfirmation();
  const { show } = useLoading();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Update active section based on pathname
  useEffect(() => {
    const currentPath = pathname.split('/').pop();
    if (currentPath && adminMenuItems.some(item => item.id === currentPath)) {
      setActiveSection(currentPath);
    }
  }, [pathname]);

  const handleLogout = () => {
    confirm({
      title: "Xác nhận đăng xuất",
      description: "Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?",
      confirmText: "Vuốt để đăng xuất",
      type: "danger",
      onConfirm: async () => {
        // Simulate 2 second loading
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show loading overlay
        show("Đang đăng xuất...");

        // Clear any auth data (if needed)
        // localStorage.removeItem('authToken');
        // sessionStorage.clear();

        // Redirect to login page
        router.replace('/login');
      }
    });
  };

  const handleSectionChange = (sectionId: string) => {
    if (sectionId === 'logout') {
      handleLogout();
    } else {
      setActiveSection(sectionId);
      router.push(`/${sectionId}`);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const activeItem = adminMenuItems.find(item => item.id === activeSection) || adminMenuItems[0];

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
                    {profileData.fullName}
                  </motion.p>
                  <motion.p
                    layoutId="profile-email"
                    className="text-xs text-gray-600 drop-shadow-sm tracking-wide whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {profileData.email}
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
        <div className="relative flex-1 py-6 px-3 flex flex-col overflow-hidden">
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
              return (
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
                  active={activeSection === item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className=""
                />
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
              onClick={() => handleSectionChange('logout')}
              className="logout-item"
            />
          )}
        </div>
      </div >

      <div className="flex-1 ml-28 flex flex-col">
        {/* Header Removed as requested */}

        {/* Page Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div >
  );
}
