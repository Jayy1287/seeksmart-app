import { LogOut } from "lucide-react";
import { signOut } from "@/auth";
import { clearAdminSessionCookie } from "@/server/admin/auth";

export function AdminLogoutButton() {
  async function logout() {
    "use server";

    await clearAdminSessionCookie();
    await signOut({
      redirectTo: "/admin/login"
    });
  }

  return (
    <form action={logout}>
      <button className="secondary-button" type="submit">
        <LogOut aria-hidden="true" size={16} />
        Sign out
      </button>
    </form>
  );
}
