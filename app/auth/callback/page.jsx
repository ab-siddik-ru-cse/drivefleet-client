"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        await api("/api/session/issue-jwt", { method: "POST" });
        await refresh();
        toast.success("Welcome!");
        const next = searchParams.get("next") || "/";
        router.replace(next);
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Could not complete sign-in. Please try again.");
        router.replace("/login");
      }
    })();
  }, [router, searchParams, refresh]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Spinner />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Finishing sign-in...
      </p>
    </div>
  );
}