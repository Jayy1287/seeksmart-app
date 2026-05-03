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
      className="secondary-button"
      onClick={handleLogout}
      type="button"
    >
      <LogOut aria-hidden="true" size={16} />
      Sign out
    </button>
  );
}
