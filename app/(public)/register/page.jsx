"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus, Check, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import GoogleButton from "@/components/GoogleButton";
import { validatePassword } from "@/lib/validation";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [show, setShow] = useState(false);

  const checks = useMemo(() => ({
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    length: password.length >= 6,
  }), [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwErr = validatePassword(password);
    if (pwErr) {
      toast.error(pwErr);
      return;
    }
    // Light validation on the image URL — server validates too but giving
    // instant feedback feels better.
    if (image.trim() && !/^https?:\/\//i.test(image.trim())) {
      toast.error("Photo URL must start with http:// or https://");
      return;
    }

    // Pass image as 4th arg — AuthProvider will save it via PATCH /api/users/me
    // after the account is created and the JWT is issued.
    const res = await register(name, email, password, image.trim());
    if (!res.ok) {
      toast.error(res.error || "Registration failed.");
      return;
    }
    toast.success("Account created!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Start renting or listing cars in minutes
            </p>
          </div>

          {/* Live avatar preview — shows initial until the image URL loads */}
          <div className="mb-5 flex justify-center">
            {image.trim() && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.trim()}
                alt="Avatar preview"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-100 dark:ring-brand-900/40"
                onLoad={() => setImageError(false)}
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-2xl font-bold text-white ring-4 ring-brand-100 dark:ring-brand-900/40">
                {(name || "?")[0]?.toUpperCase()}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <input
                id="name" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input"
                autoComplete="name"
              />
            </div>

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
              <label htmlFor="image" className="label">
                <ImageIcon size={13} className="inline" /> Profile photo URL (optional)
              </label>
              <input
                id="image" type="url" value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImageError(false);
                }}
                placeholder="https://i.ibb.co/..."
                className="input"
              />
              {imageError && image.trim() && (
                <p className="mt-1.5 text-xs text-red-600">
                  Couldn&apos;t load that image. You can change it later from your profile.
                </p>
              )}
              {!imageError && (
                <p className="mt-1.5 text-xs text-gray-500">
                  Paste a public image URL or leave blank to use your initials.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password" type={show ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button" onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <ul className="mt-2 space-y-0.5 text-xs">
                <Hint ok={checks.upper}>At least one uppercase letter</Hint>
                <Hint ok={checks.lower}>At least one lowercase letter</Hint>
                <Hint ok={checks.length}>Minimum 6 characters</Hint>
              </ul>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <UserPlus size={16} /> {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span>OR</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <GoogleButton />

          <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Hint({ ok, children }) {
  return (
    <li className={`flex items-center gap-1.5 ${ok ? "text-emerald-600" : "text-gray-500"}`}>
      {ok ? <Check size={12} /> : <X size={12} />} {children}
    </li>
  );
}
