"use client";

import { useState, useEffect } from "react";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Mail, ArrowLeft, CheckCircle, User } from "@repo/ui/icons";
import { FloatingLabelInput, CalendarDatePicker } from "@repo/ui";
import OTPInput from "./OTPInput";
import ProgressBar from "./ProgressBar";
import {
  emailVerificationSchema,
  // otpSchema,
  userInfoSchema,
  type EmailVerificationData,
  // type OTPData,
  type UserInfoData,
} from "./schemas/registerSchema";
import { register, getHotels } from "@/features/auth/api";
import { setAccessToken } from "@repo/api";
import { useAuthStore } from "@repo/store";

interface RegisterFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Step = "email" | "otp" | "info" | "success";

interface Hotel {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  city: string;
}

export default function RegisterForm({ onBack, onSuccess }: RegisterFormProps) {
  // Skip email/OTP steps - go directly to info
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();

  // Fetch hotels on mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotels();
        if (response.success && response.data) {
          setHotels(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  // Email form (Hidden)
  const emailForm = useForm<EmailVerificationData>({
    resolver: zodResolver(emailVerificationSchema),
    mode: "onChange",
  });

  // User info form
  const infoForm = useForm<UserInfoData>({
    resolver: zodResolver(userInfoSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      hotelId: "",
      brandId: "",
    },
  });

  const handleEmailSubmit = async (data: EmailVerificationData) => {
    setIsLoading(true);
    setEmail(data.email);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setCurrentStep("otp");
  };

  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      setOtpError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setIsLoading(true);
    setOtpError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - Accept "123456" as correct OTP
    if (otp === "123456") {
      setIsLoading(false);
      setCurrentStep("info");
    } else {
      setIsLoading(false);
      setOtpError("Mã OTP không chính xác");
    }
  };

  const handleInfoSubmit = async (data: UserInfoData) => {
    setIsLoading(true);
    setError("");

    try {
      const registerData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: 0, // Customer role
        brandId: data.brandId || selectedHotel?.brandId || "00000000-0000-0000-0000-000000000000",
        hotelId: data.hotelId,
      };

      const response = await register(registerData);

      if (response.success && response.data) {
        // Set access token
        setAccessToken(response.data.accessToken);
        
        // Store refresh token
        if (response.data.refreshToken) {
          localStorage.setItem("refresh_token", response.data.refreshToken);
        }
        
        // Update store with user info
        if (response.data.userId) {
          setUser({
            id: response.data.userId,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            role: response.data.role,
          } as any);
        }

        setIsLoading(false);
        setCurrentStep("success");
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error?.response?.data?.message || error?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  const handleHotelChange = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    setSelectedHotel(hotel || null);
    infoForm.setValue("hotelId", hotelId, { shouldValidate: true });
    if (hotel) {
      infoForm.setValue("brandId", hotel.brandId);
    }
  };

  const getStepNumber = () => {
    // Only 1 step now since we skip email/OTP
    return 1;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex flex-col">
      {/* Header with back button */}
      {currentStep !== "success" && (
        <div className="w-full px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors duration-200 group"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1 duration-200" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      )}

      {/* Progress Bar - Hidden since we only have 1 step */}
      {false && currentStep !== "success" && (
        <div className="px-6 py-4">
          <ProgressBar currentStep={getStepNumber()} totalSteps={1} steps={["Đăng ký tài khoản"]} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Email & OTP Steps - Hidden */}
            {false && currentStep === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Email step content - kept for reference but hidden */}
              </motion.div>
            )}

            {false && currentStep === "otp" && (
              <motion.div key="otp">
                {/* OTP step content - kept for reference but hidden */}
              </motion.div>
            )}

            {/* Step 3: User Info - Now the first and only step */}
            {currentStep === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center"
                  >
                    <User size={32} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
                  <p className="text-gray-600">Điền thông tin để tạo tài khoản mới</p>
                </div>

                <form onSubmit={infoForm.handleSubmit(handleInfoSubmit)} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                      label="Họ"
                      type="text"
                      value={infoForm.watch("lastName")}
                      error={infoForm.formState.errors.lastName?.message}
                      {...infoForm.register("lastName")}
                    />

                    <FloatingLabelInput
                      label="Tên"
                      type="text"
                      value={infoForm.watch("firstName")}
                      error={infoForm.formState.errors.firstName?.message}
                      {...infoForm.register("firstName")}
                    />
                  </div>

                  <FloatingLabelInput
                    label="Email"
                    type="email"
                    value={infoForm.watch("email")}
                    error={infoForm.formState.errors.email?.message}
                    {...infoForm.register("email")}
                  />

                  <FloatingLabelInput
                    label="Số điện thoại"
                    type="tel"
                    value={infoForm.watch("phoneNumber")}
                    error={infoForm.formState.errors.phoneNumber?.message}
                    {...infoForm.register("phoneNumber")}
                  />

                  {/* Hotel Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Khách sạn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={infoForm.watch("hotelId")}
                      onChange={(e) => handleHotelChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                    >
                      <option value="">Chọn khách sạn</option>
                      {hotels.map((hotel) => (
                        <option key={hotel.id} value={hotel.id}>
                          {hotel.name} - {hotel.city} ({hotel.brandName})
                        </option>
                      ))}
                    </select>
                    {infoForm.formState.errors.hotelId && (
                      <p className="text-red-500 text-sm mt-1">{infoForm.formState.errors.hotelId.message}</p>
                    )}
                  </div>

                  <FloatingLabelInput
                    label="Mật khẩu"
                    type="password"
                    value={infoForm.watch("password")}
                    error={infoForm.formState.errors.password?.message}
                    {...infoForm.register("password")}
                  />

                  <FloatingLabelInput
                    label="Xác nhận mật khẩu"
                    type="password"
                    value={infoForm.watch("confirmPassword")}
                    error={infoForm.formState.errors.confirmPassword?.message}
                    {...infoForm.register("confirmPassword")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang tạo tài khoản...</span>
                      </div>
                    ) : (
                      "Hoàn tất đăng ký"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Success Screen */}
            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-gray-900 mb-3"
                >
                  Chúc mừng!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-8"
                >
                  Tài khoản của bạn đã được tạo thành công
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onSuccess}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                  Đăng nhập ngay
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

