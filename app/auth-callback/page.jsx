"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";

/**
 * This is where Google (via Better Auth) redirects after a successful
 * social sign-in. The Better Auth session cookie is already set at this
 * point — we just need to mint our JWT cookie on top of it.
 *
 * After issueJwt() succeeds, we send the user home (or to ?redirect=).
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { issueJwt } = useAuth();
  const ran = useRef(false); // guard against React 18 strict-mode double-invoke

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        await issueJwt();
        toast.success("Welcome!");

        // Honor a ?redirect=/somewhere query if present (sanity-check it's a path).
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        const target = redirect && redirect.startsWith("/") ? redirect : "/";

        router.replace(target);
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Sign-in could not be completed.");
        router.replace("/login");
      }
    })();
  }, [issueJwt, router]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Spinner />
      <p className="mt-2 text-gray-600 dark:text-gray-400">Finishing sign-in...</p>
    </div>
  );
}
