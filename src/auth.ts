import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withPostHogClient } from "@/lib/posthog-server";

const DEFAULT_ADMIN_EMAIL = "seeksmartapp@gmail.com";

export function getAdminEmails() {
  return new Set(
    [
      DEFAULT_ADMIN_EMAIL,
      ...(process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
    ].map((email) => email.toLowerCase())
  );
}

export function isAdminEmail(email?: string | null) {
  return email ? getAdminEmails().has(email.toLowerCase()) : false;
}

export function getEffectiveUserRole({
  email,
  role
}: {
  email?: string | null;
  role?: UserRole | null;
}) {
  if (role === UserRole.ADMIN || isAdminEmail(email)) {
    return UserRole.ADMIN;
  }

  return UserRole.USER;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = getEffectiveUserRole({
          email: user.email,
          role: user.role
        });
      }

      return session;
    }
  },
  events: {
    async signIn({ user, isNewUser }) {
      await withPostHogClient((posthog) => {
        if (!user.id) {
          return;
        }

        posthog.identify({
          distinctId: user.id,
          properties: {
            role: isAdminEmail(user.email) ? "admin" : "user"
          }
        });
        posthog.capture({
          distinctId: user.id,
          event: "user_signed_in",
          properties: {
            is_new_user: isNewUser ?? false,
            provider: "google"
          }
        });
      });

      if (!user.id || !isAdminEmail(user.email)) {
        return;
      }

      await prisma.user.update({
        data: {
          role: UserRole.ADMIN
        },
        where: {
          id: user.id
        }
      });
    }
  },
  pages: {
    signIn: "/login"
  },
  providers: [Google],
  session: {
    strategy: "database"
  },
  trustHost: true
});
