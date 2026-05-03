import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/admin-login-form";
import {
  isAdminAuthConfigured,
  isAdminAuthenticated
} from "@/server/admin/auth";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const isConfigured = isAdminAuthConfigured();

  return (
    <main className="page-shell">
      <div className="app-container grid max-w-3xl gap-6">
      <section className="surface-strong rounded-2xl p-6">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 text-4xl font-semibold">Review workspace</h1>
        <p className="mt-3 leading-7 text-ink/65">
          Sign in to review submitted tools and publish approved entries.
        </p>
      </section>
      {isConfigured ? (
        <AdminLoginForm />
      ) : (
        <div className="surface-panel rounded-xl border-signal/30 p-5 text-sm leading-6 text-signal">
          Admin auth is not configured. Add ADMIN_PASSWORD to the environment
          before using the review workspace.
        </div>
      )}
      </div>
    </main>
  );
}
