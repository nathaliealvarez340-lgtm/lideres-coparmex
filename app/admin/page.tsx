import { cookies } from "next/headers";
import { AdminDashboard } from "../ui/admin-dashboard";
import { AdminLogin } from "../ui/admin-login";
import { adminCookieName, verifyAdminSession } from "../lib/admin-auth";
import { listCandidateApplications } from "../lib/application-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const hasSession = verifyAdminSession(cookieStore.get(adminCookieName)?.value);

  if (!hasSession) {
    return <AdminLogin />;
  }

  const applications = await listCandidateApplications();

  return <AdminDashboard initialApplications={applications} />;
}
