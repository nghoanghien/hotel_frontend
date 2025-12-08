"use client";

export default function LoginIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-12 md:p-16">
      <div className="relative w-full max-w-md aspect-square">
        <div
          className="absolute bottom-0 left-[5%] w-[40%] h-[35%] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full shadow-2xl animate-float-slow"
          style={{ animationDelay: '0s' }}
        >
        </div>

        <div
          className="absolute bottom-[15%] left-[25%] w-[30%] h-[45%] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl animate-float-medium"
          style={{ animationDelay: '0.5s' }}
        >
        </div>

        <div
          className="absolute bottom-[10%] left-[15%] w-[28%] h-[60%] bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-2xl animate-float-slow-reverse"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 w-1 h-6 bg-white/20 rounded-full"></div>
        </div>

        <div
          className="absolute bottom-[18%] right-[10%] w-[32%] h-[50%] bg-gradient-to-br from-orange-300 to-orange-400 rounded-3xl shadow-2xl animate-float-medium-reverse"
          style={{ animationDelay: '0.8s' }}
        >
        </div>

        <div className="absolute top-[10%] right-[15%] w-8 h-8 bg-[var(--primary)]/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[20%] left-[10%] w-6 h-6 bg-yellow-300/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[60%] right-[25%] w-5 h-5 bg-orange-400/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}