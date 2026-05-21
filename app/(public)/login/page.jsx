"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import GoogleButton from "@/components/GoogleButton";
import Spinner from "@/components/Spinner";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16"><Spinner /></div>}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (!res.ok) {
      toast.error(res.error || "Login failed.");
      return;
    }
    toast.success("Welcome back!");
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Log in to your DriveFleet account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password" type={show ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button" onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <LogIn size={16} /> {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span>OR</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <GoogleButton />

          <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-brand-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
