"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  User, Mail, Calendar, Pencil, ShieldCheck,
  KeyRound, Chrome,
} from "lucide-react";
import Spinner from "@/components/Spinner";
import { api } from "@/lib/api";

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api("/api/users/me");
        if (!cancelled) setProfile(data.user);
      } catch (err) {
        if (!cancelled) toast.error(err.message || "Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-10"><Spinner /></div>;
  }

  if (!profile) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Profile unavailable</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please try logging out and back in.</p>
      </div>
    );
  }

  const isGoogle = profile.provider === "google";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            View and manage your account details.
          </p>
        </div>
        <Link href="/profile/edit" className="btn-primary">
          <Pencil size={16} /> Edit Profile
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
      >
        {/* Header — avatar + name + email */}
        <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 text-center sm:flex-row sm:text-left dark:border-gray-800">
          <Avatar src={profile.image} name={profile.name || profile.email} />
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{profile.name || "Unnamed user"}</h2>
            <p className="mt-0.5 truncate text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
            <ProviderBadge provider={profile.provider} className="mt-2" />
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
          <Field icon={User} label="Full name" value={profile.name || "—"} />
          <Field icon={Mail} label="Email" value={profile.email} />
          <Field
            icon={isGoogle ? Chrome : KeyRound}
            label="Sign-in method"
            value={isGoogle ? "Google account" : "Email + password"}
          />
          <Field icon={Calendar} label="Member since" value={fmtDate(profile.createdAt)} />
        </div>

        {/* Email change note */}
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          <p>
            Your email address is tied to your sign-in method and can&apos;t be changed here.
            {isGoogle && " Manage it from your Google account."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Avatar({ src, name }) {
  const initial = (name || "?")[0]?.toUpperCase();
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-brand-100 dark:ring-brand-900/40"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    );
  }
  return (
    <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-brand-600 text-3xl font-bold text-white ring-4 ring-brand-100 dark:ring-brand-900/40">
      {initial}
    </span>
  );
}

function ProviderBadge({ provider, className = "" }) {
  if (provider === "google") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 ${className}`}>
        <Chrome size={12} /> Google
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300 ${className}`}>
      <KeyRound size={12} /> Email
    </span>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500">
        <Icon size={12} /> {label}
      </p>
      <p className="mt-1 truncate font-semibold">{value}</p>
    </div>
  );
}
