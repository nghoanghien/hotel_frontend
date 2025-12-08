"use client";

import { useEffect, useState } from "react";
import { Users, Star, Clock, TrendingUp, Gift, Zap } from "@repo/ui/icons";
import FeatureCard from "./FeatureCard";
import { FeatureCardData } from "../types";

interface FeatureGridProps {
  visible: boolean;
}

export default function FeatureGrid({ visible }: FeatureGridProps) {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setParallax(Math.min(30, window.scrollY * 0.03));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features: (FeatureCardData & { gridClass: string })[] = [
    {
      title: "Du khách tin dùng",
      stats: "1M+",
      description: "Người dùng hài lòng với dịch vụ đặt phòng",
      icon: <Users size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
      tags: ["Uy tín"],
      gridClass: "col-span-12 sm:col-span-6 md:col-span-4 row-span-5",
    },
    {
      title: "Xác nhận tức thì",
      subtitle: "Chỉ trong 30s",
      description: "Nhận mã đặt phòng ngay qua email/SMS",
      icon: <Clock size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-lime-400 to-emerald-500",
      gridClass: "col-span-6 sm:col-span-6 md:col-span-2 row-span-2",
    },
    {
      title: "Ưu đãi độc quyền",
      subtitle: "Giảm đến 70%",
      description: "Flash sale mỗi ngày cho các khách sạn 5 sao",
      icon: <Gift size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-orange-400 to-red-500",
      gridClass: "col-span-6 sm:col-span-6 md:col-span-3 row-span-4",
    },
    {
      title: "Chất lượng 5 sao",
      stats: "4.9⭐",
      description: "Được đánh giá bởi cộng đồng du lịch quốc tế",
      icon: <Star size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-yellow-400 to-orange-500",
      gridClass: "col-span-12 sm:col-span-6 md:col-span-3 row-span-5",
    },
    {
      title: "Mạng lưới rộng khắp",
      subtitle: "20QG+",
      description: "Kết nối hơn 1 triệu khách sạn toàn cầu",
      icon: <TrendingUp size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
      gridClass: "col-span-12 sm:col-span-12 md:col-span-4 row-span-3",
    },
    {
      title: "Trải nghiệm mượt mà",
      description: "Tìm và đặt phòng dễ dàng với bộ lọc thông minh",
      icon: <Zap size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-purple-400 to-pink-500",
      gridClass: "col-span-12 sm:col-span-12 md:col-span-7 row-span-4",
    },
    {
      title: "Thanh toán an toàn",
      description: "Bảo mật tuyệt đối thông tin thẻ & giao dịch",
      icon: <Zap size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-teal-400 to-cyan-500",
      gridClass: "col-span-12 sm:col-span-6 md:col-span-3 row-span-2",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-4 lg:gap-x-6 lg:gap-y-8 h-auto lg:h-[90vh] auto-rows-min lg:grid-rows-9">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`${feature.gridClass} transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <FeatureCard {...feature} index={index} parallaxOffset={parallax} />
        </div>
      ))}
    </div>
  );
}

