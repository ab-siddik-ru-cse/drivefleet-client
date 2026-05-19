import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ToastProvider from "@/components/ToastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "DriveFleet — Rent a car your way",
  description: "Browse hundreds of vehicles from trusted owners. Book in seconds.",
};

// Avoid theme-flash on first load
const themeScript = `
(function(){try{
  var s=localStorage.getItem('df-theme');
  if(s==='dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)){
    document.documentElement.classList.add('dark');
  }
}catch(e){}})();
`;

export default async function RootLayout({ children }) {
  // Read user server-side so the navbar renders correctly on first paint
  // and reloads on private routes don't redirect.
  const initialUser = await getCurrentUser();

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
