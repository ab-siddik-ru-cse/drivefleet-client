import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function PrivateLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <>{children}</>;
}
