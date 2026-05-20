import "./globals.css";
import { cookies } from "next/headers";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ToastProvider from "@/components/ToastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiServer } from "@/lib/api";

export const metadata = {
  title: "DriveFleet — Rent a car your way",
  description: "Browse hundreds of vehicles from trusted owners. Book in seconds.",
};

// Prevent theme flash on first paint
const themeScript = `
(function(){try{
  var s=localStorage.getItem('df-theme');
  if(s==='dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)){
    document.documentElement.classList.add('dark');
  }
}catch(e){}})();
`;

/**
 * Fetch the current user from the server during SSR so the Navbar
 * renders correctly on first paint (no flicker, no flash of logged-out UI).
 *
 * We forward the incoming request's cookies to the server so it can
 * read the df_token / Better Auth session.
 */
async function getInitialUser() {
  const cookieHeader = cookies().toString();
  const data = await apiServer("/api/session/me", cookieHeader);
  return data?.user ?? null;
}

export default async function RootLayout({ children }) {
  const initialUser = await getInitialUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider initialUser={initialUser}>
            <ToastProvider />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
