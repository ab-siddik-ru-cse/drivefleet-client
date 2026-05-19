"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "var(--toast-bg, #fff)",
          color: "var(--toast-color, #111)",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }}
    />
  );
}
