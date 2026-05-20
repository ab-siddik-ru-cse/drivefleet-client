"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, User, Image as ImageIcon } from "lucide-react";
import Spinner from "@/components/Spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export default function EditProfilePage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [initialName, setInitialName] = useState("");
  const [initialImage, setInitialImage] = useState("");

  // Load current profile to prefill the form
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api("/api/users/me");
        if (cancelled) return;
        setName(data.user.name || "");
        setImage(data.user.image || "");
        setInitialName(data.user.name || "");
        setInitialImage(data.user.image || "");
      } catch (err) {
        if (!cancelled) toast.error(err.message || "Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const hasChanges = name.trim() !== initialName || image.trim() !== initialImage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!hasChanges) {
      toast("No changes to save.", { icon: "ℹ️" });
      return;
    }
    setSubmitting(true);
    try {
      // PATCH only the fields that changed.
      const body = {};
      if (name.trim() !== initialName) body.name = name.trim();
      if (image.trim() !== initialImage) body.image = image.trim() || null;

      await api("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      // Refresh the auth context so navbar and other places see the new name.
      await refresh();

      toast.success("Profile updated.");
      router.push("/profile");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-10"><Spinner /></div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/profile"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-400"
      >
        <ArrowLeft size={16} /> Back to Profile
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Update your personal details.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar preview */}
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Avatar preview"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-900/40"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-2xl font-bold text-white">
                {(name || "?")[0]?.toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{name || "Unnamed user"}</p>
              <p className="text-xs text-gray-500">Preview of how you&apos;ll appear.</p>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="label">
              <User size={13} className="inline" /> Full name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="John Doe"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="image" className="label">
              <ImageIcon size={13} className="inline" /> Profile photo URL (optional)
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="input"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Paste a public image URL. Leave blank to use your initials.
            </p>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-5 dark:border-gray-800">
            <Link href="/profile" className="btn-outline">Cancel</Link>
            <button type="submit" disabled={submitting || !hasChanges} className="btn-primary">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
