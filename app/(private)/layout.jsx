import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiServer } from "@/lib/api";

export default async function PrivateLayout({ children }) {
  const cookieHeader = cookies().toString();
  const data = await apiServer("/api/session/me", cookieHeader);

  if (!data?.user) {
    redirect("/login");
  }
  return <>{children}</>;
}
