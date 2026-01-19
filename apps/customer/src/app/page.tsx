"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, restoreAccessToken } from "@repo/api";
import { LandingPageV2 } from "../components/landing-v2";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if already have access token
      if (getAccessToken()) {
        router.replace("/home");
        return;
      }

      // Try to restore from refresh token
      const restored = await restoreAccessToken();
      if (restored) {
        router.replace("/home");
        return;
      }

      // Not authenticated, show landing page
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Show nothing while checking auth
  if (isChecking) {
    return null;
  }

  return <LandingPageV2 />;
}
