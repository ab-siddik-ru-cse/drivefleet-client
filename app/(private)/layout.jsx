import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiServer } from "@/lib/api";

/**
 * Server-side auth guard for the (private) route group.
 *
 * Asks the server "who am I?" by forwarding the request cookies.
 * If the server says no user, we redirect to /login.
 *
 * Because this runs server-side on every request, a hard refresh of
 * /my-cars (or any private route) stays on the page — exactly what the
 * assignment requires.
 */
export default async function PrivateLayout({ children }) {
  const cookieHeader = cookies().toString();
  const data = await apiServer("/api/session/me", cookieHeader);

  if (!data?.user) {
    redirect("/login");
  }
  return <>{children}</>;
}
