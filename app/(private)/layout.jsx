"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getStoredToken } from "@/lib/api";
import Spinner from "@/components/Spinner";

/**
 * Client-side auth guard. SSR cannot read localStorage, so the check
 * must happen in the browser. Pattern:
 *   1. If no token in localStorage → redirect to login immediately (no flash)
 *   2. If token present → call /api/session/me to verify with server
 *   3. If server says invalid → clear and redirect
 *   4. If server says ok → render children
 */
export default function PrivateLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, refresh } = useAuth();
  const [checking, setChecking] = useState(true);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Quick check: no token at all → straight to login.
      if (!getStoredToken() && !user) {
        const redirect = encodeURIComponent(pathname || "/");
        router.replace(`/login?redirect=${redirect}`);
        return;
      }

      // Have a token (or already-loaded user). Verify with server once.
      if (!verifyAttempted.current) {
        verifyAttempted.current = true;
        const fresh = await refresh();
        if (cancelled) return;
        if (!fresh) {
          const redirect = encodeURIComponent(pathname || "/");
          router.replace(`/login?redirect=${redirect}`);
          return;
        }
      }

      if (!cancelled) setChecking(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (checking || !user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}