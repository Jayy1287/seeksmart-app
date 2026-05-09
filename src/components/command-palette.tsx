"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Command as CommandIcon } from "lucide-react";

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
  isAdmin: boolean;
  isSignedIn: boolean;
  trigger?: "footer" | "none";
};

export function CommandPalette({
  isAdmin,
  isSignedIn,
  trigger = "none"
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");

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
      setIsOpen((currentValue) => !currentValue);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {trigger === "footer" ? (
        <button
          aria-label="Open command palette"
          className="command-easter-egg"
          onClick={() => setIsOpen(true)}
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
