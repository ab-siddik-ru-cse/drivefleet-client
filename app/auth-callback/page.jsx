"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setStoredToken } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const hash = window.location.hash || "";
        const m = hash.match(/[#&]token=([^&]+)/);

        if (!m) {
          toast.error("Sign-in could not be completed (no token).");
          router.replace("/login");
          return;
        }

        const token = decodeURIComponent(m[1]);
        setStoredToken(token);

        window.history.replaceState(null, "", "/auth-callback");

        await refresh();

        toast.success("Welcome!");
        router.replace("/");
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Sign-in could not be completed.");
        router.replace("/login");
      }
    })();
  }, [refresh, router]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Spinner />
      <p className="mt-2 text-gray-600 dark:text-gray-400">Finishing sign-in...</p>
    </div>
  );
}