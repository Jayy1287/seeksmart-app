"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Command as CommandIcon, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { capturePostHogEvent } from "@/features/analytics/posthog-client";

const CommandPaletteDialog = dynamic(
  () =>
    import("@/components/command-palette-dialog").then(
      (mod) => mod.CommandPaletteDialog
    ),
  {
    ssr: false
  }
);

type CommandPaletteProps = {
  trigger?: "footer" | "header" | "none";
};

export function CommandPalette({ trigger = "none" }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.user);
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const isMac =
      navigator.platform.toLowerCase().includes("mac") ||
      navigator.userAgent.toLowerCase().includes("mac");
    setShortcutLabel(isMac ? "⌘ K" : "Ctrl K");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") {
        return;
      }

      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      setIsOpen((currentValue) => {
        if (!currentValue) {
          capturePostHogEvent("command_palette_opened", {
            trigger: "keyboard"
          });
        }
        return !currentValue;
      });
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {trigger === "header" ? (
        <button
          aria-label="Search SeekSmart"
          className="group inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-ink/55 transition-colors hover:bg-ink/[0.05] hover:text-ink"
          onClick={() => {
            capturePostHogEvent("command_palette_opened", {
              trigger: "header_button"
            });
            setIsOpen(true);
          }}
          type="button"
        >
          <Search aria-hidden="true" size={16} />
          <span className="hidden xl:inline">Search</span>
          <kbd className="kbd hidden xl:inline-flex">{shortcutLabel}</kbd>
        </button>
      ) : null}
      {trigger === "footer" ? (
        <button
          aria-label="Open command palette"
          className="command-easter-egg"
          onClick={() => {
            capturePostHogEvent("command_palette_opened", {
              trigger: "footer_button"
            });
            setIsOpen(true);
          }}
          type="button"
        >
          <CommandIcon aria-hidden="true" size={14} />
          <span>Try quick search</span>
          <kbd>{shortcutLabel}</kbd>
        </button>
      ) : null}
      {isOpen ? (
        <CommandPaletteDialog
          isAdmin={isAdmin}
          isOpen={isOpen}
          isSignedIn={isSignedIn}
          onOpenChange={setIsOpen}
        />
      ) : null}
    </>
  );
}
