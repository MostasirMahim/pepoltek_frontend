import { Metadata } from "next";
import { AdminUsersView } from "@/components/admin/users/AdminUsersView";
import { getAdminUsersAction } from "@/actions/admin.actions";

export const metadata: Metadata = {
  title: "User Directory & RBAC Control | Pepoltek Admin",
  description: "Manage users across candidate, recruiter, validator, and superadmin personas with immutable audit logs.",
};

export default async function AdminUsersPage() {
  const users = await getAdminUsersAction();
  return <AdminUsersView initialUsers={users} />;
}
