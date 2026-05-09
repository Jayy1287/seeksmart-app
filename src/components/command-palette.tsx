"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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
};

export function CommandPalette({ isAdmin, isSignedIn }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
      <button
        aria-label="Open command palette"
        className="command-trigger"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Search aria-hidden="true" size={16} />
        <span>Search</span>
        <kbd>Ctrl K</kbd>
      </button>
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
