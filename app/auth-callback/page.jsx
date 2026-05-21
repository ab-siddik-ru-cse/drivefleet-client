"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setStoredToken } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";

/**
 * Server's google-handoff endpoint redirects here with the JWT in the
 * URL hash: /auth-callback#token=<jwt>
 *
 * We read the hash, store the token in localStorage, then redirect to
 * home. The hash never reaches the server so it's not logged anywhere.
 */
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

        // Clear the hash from the URL so the token isn't visible.
        window.history.replaceState(null, "", "/auth-callback");

        // Verify and load user data into the auth context.
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