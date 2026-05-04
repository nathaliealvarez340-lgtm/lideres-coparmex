import { cookies } from "next/headers";
import { AdminDashboard } from "../ui/admin-dashboard";
import { AdminLogin } from "../ui/admin-login";
import { adminCookieName, verifyAdminSession } from "../lib/admin-auth";
import { listCandidateApplications } from "../lib/application-store";
import type { CandidateApplication } from "../lib/application-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let hasSession = false;
  let applications: CandidateApplication[] = [];

  try {
    const cookieStore = await cookies();
    hasSession = verifyAdminSession(cookieStore.get(adminCookieName)?.value);

    if (hasSession) {
      applications = await listCandidateApplications();
    }
  } catch (error) {
    console.error("Admin dashboard error:", error);
  }

  return hasSession ? (
    <AdminDashboard initialApplications={applications} />
  ) : (
    <AdminLogin />
  );
}
