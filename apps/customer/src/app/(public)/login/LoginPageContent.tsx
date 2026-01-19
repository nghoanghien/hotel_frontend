"use client";

import { useLogin } from "../../../features/auth/hooks/useLogin";
import { LoginForm, LoginIllustration } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLoading } from "@repo/ui";
import { useEffect, useState } from "react";
import { getAccessToken, restoreAccessToken } from "@repo/api";

/**
 * Login Page Content
 */
export default function LoginPageContent() {
  const router = useRouter();
  const { show, hide } = useLoading();
  const { mutate, isPending, error, reset } = useLogin();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (getAccessToken()) {
        router.replace("/home");
        return;
      }

      const restored = await restoreAccessToken();
      if (restored) {
        router.replace("/home");
        return;
      }

      setIsCheckingAuth(false);
      show("Đang tải trang đăng nhập...");
      setTimeout(() => hide(), 1000);
    };

    checkAuth();
  }, [router, show, hide]);

  const handleRegisterClick = () => {
    router.push("/register");
  };

  // Don't render form while checking auth
  if (isCheckingAuth) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
        <motion.div
          layoutId="auth-container"
          className="w-full max-w-5xl rounded-[32px] md:rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden text-white"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.5,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
            {/* Left Column - Illustration */}
            <div className="hidden lg:flex relative overflow-hidden bg-white/5 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--secondary)]/10"></div>
              <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--primary)]/20 rounded-full blur-2xl animate-pulse-slow"></div>
              <div className="absolute bottom-20 left-10 w-32 h-32 bg-[var(--secondary)]/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              <LoginIllustration />
            </div>

            {/* Right Column - Login Form */}
            <div className="bg-white rounded-r-[32px] md:rounded-r-[40px] shadow-xl relative">
              <div className="relative z-10 w-full h-full">
                <LoginForm
                  form={form}
                  onForgotPassword={() => router.push("/forgot-password")}
                  onSuccess={(data) => {
                    reset(); // Clear previous errors
                    show("Đang đăng nhập...");
                    mutate(data, {
                      onSuccess: () => {
                        show("Đăng nhập thành công! Đang chuyển hướng...");
                        router.push("/home");
                      },
                      onError: () => {
                        hide();
                      }
                    });
                  }}
                  onRegister={handleRegisterClick}
                  isLoading={isPending}
                  error={error}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
