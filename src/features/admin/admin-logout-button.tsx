"use client";

import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST"
    });

    window.location.assign("/admin/login");
  }

  return (
    <button
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium"
      onClick={handleLogout}
      type="button"
    >
      <LogOut aria-hidden="true" size={16} />
      Sign out
    </button>
  );
}
