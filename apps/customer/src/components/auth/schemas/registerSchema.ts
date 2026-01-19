import { z } from "@repo/lib/zod";

// Step 1: Email verification (Hidden/Disabled)
export const emailVerificationSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP phải có 6 chữ số"),
});

// Step 2: User information + Registration
export const userInfoSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  firstName: z.string().min(1, "Tên là bắt buộc").min(2, "Tên phải có ít nhất 2 ký tự"),
  lastName: z.string().min(1, "Họ là bắt buộc").min(2, "Họ phải có ít nhất 2 ký tự"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  hotelId: z.string().min(1, "Vui lòng chọn khách sạn"),
  brandId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
export type OTPData = z.infer<typeof otpSchema>;
export type UserInfoData = z.infer<typeof userInfoSchema>;

