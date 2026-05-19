"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { capturePostHogEvent } from "@/features/analytics/posthog-client";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Gauge,
  LayoutDashboard,
  LibraryBig,
  Search,
  Settings,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type {
  CommandSearchGroup,
  CommandSearchResponse
} from "@/shared/command-search";

type CommandPaletteDialogProps = {
  isAdmin: boolean;
  isOpen: boolean;
  isSignedIn: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type StaticCommand = {
  description: string;
  href: string;
  icon: typeof Search;
  label: string;
};

const searchDelayMs = 180;

export function CommandPaletteDialog({
  isAdmin,
  isOpen,
  isSignedIn,
  onOpenChange
}: CommandPaletteDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<CommandSearchGroup[]>([]);
  const [isPending, startTransition] = useTransition();

  const staticCommands = useMemo(
    () => buildStaticCommands({ isAdmin, isSignedIn }),
    [isAdmin, isSignedIn]
  );

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setGroups([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      startTransition(() => {
        void fetch(
          `/api/v1/search?q=${encodeURIComponent(trimmedQuery)}`,
          {
            signal: controller.signal
          }
        )
          .then(async (response) => {
            if (!response.ok) {
              setGroups([]);
              return;
            }

            const payload = (await response.json()) as CommandSearchResponse;
            setGroups(payload.groups);
          })
          .catch((error: unknown) => {
            if (error instanceof DOMException && error.name === "AbortError") {
              return;
            }

            setGroups([]);
          });
      });
    }, searchDelayMs);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  function openHref(href: string, label?: string, type?: string) {
    capturePostHogEvent("command_result_selected", {
      href,
      label,
      result_type: type
    });
    onOpenChange(false);
    router.push(href as Route);
  }

  return (
    <Command.Dialog
      contentClassName="command-dialog"
      label="SeekSmart command palette"
      loop
      onOpenChange={onOpenChange}
      open={isOpen}
      overlayClassName="command-overlay"
      shouldFilter
    >
      <Dialog.Title className="sr-only">SeekSmart command palette</Dialog.Title>
      <Dialog.Description className="sr-only">
        Search and open SeekSmart pages, tools, use cases, industries, playbooks,
        dashboards, and admin shortcuts.
      </Dialog.Description>
      <div className="command-input-shell">
        <Search aria-hidden="true" className="text-ink/42" size={18} />
        <Command.Input
          autoFocus
          className="command-input"
          onValueChange={setQuery}
          placeholder="Search pages, tools, use cases..."
          value={query}
        />
      </div>
      <Command.List className="command-list">
        <Command.Empty className="command-empty">
          No matching paths found.
        </Command.Empty>
        <Command.Group className="command-group" heading="Go To">
          {staticCommands.map((command) => {
            const Icon = command.icon;

            return (
              <Command.Item
                className="command-item"
                key={command.href}
                onSelect={() => openHref(command.href, command.label, "static")}
                value={`${command.label} ${command.description}`}
              >
                <Icon aria-hidden="true" size={17} />
                <span>
                  <strong>{command.label}</strong>
                  <small>{command.description}</small>
                </span>
              </Command.Item>
            );
          })}
        </Command.Group>
        {isPending ? (
          <Command.Loading className="command-loading">
            Searching...
          </Command.Loading>
        ) : null}
        {groups.map((group) => (
          <Command.Group
            className="command-group"
            heading={group.heading}
            key={group.heading}
          >
            {group.items.map((item) => (
              <Command.Item
                className="command-item"
                key={`${item.type}-${item.id}`}
                onSelect={() => openHref(item.href, item.label, item.type)}
                value={`${item.label} ${item.description ?? ""} ${item.type}`}
              >
                <Sparkles aria-hidden="true" size={17} />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description ?? item.href}</small>
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}

function buildStaticCommands({
  isAdmin,
  isSignedIn
}: {
  isAdmin: boolean;
  isSignedIn: boolean;
}) {
  const commands: StaticCommand[] = [
    {
      description: "Start or continue an AI audit",
      href: "/audit/start",
      icon: Gauge,
      label: "Run AI audit"
    },
    {
      description: "Browse the curated tool directory",
      href: "/tools",
      icon: Search,
      label: "Search tools"
    },
    {
      description: "Compare AI workflows by business outcome",
      href: "/use-cases",
      icon: BriefcaseBusiness,
      label: "Browse use cases"
    },
    {
      description: "Explore industry-specific starting points",
      href: "/industries",
      icon: LibraryBig,
      label: "Browse industries"
    },
    {
      description: "Open implementation guides",
      href: "/playbooks",
      icon: BookOpen,
      label: "Browse playbooks"
    },
    {
      description: "Open practical decision resources",
      href: "/resources",
      icon: BarChart3,
      label: "Resources"
    }
  ];

  if (isSignedIn) {
    commands.push({
      description: "View saved audit briefs",
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Open dashboard"
    });
  }

  if (isAdmin) {
    commands.push(
      {
        description: "Review submitted tools",
        href: "/admin",
        icon: ShieldCheck,
        label: "Admin review queue"
      },
      {
        description: "Manage published catalog entries",
        href: "/admin/tools",
        icon: Settings,
        label: "Admin tool catalog"
      },
      {
        description: "Edit taxonomy records",
        href: "/admin/intelligence",
        icon: Sparkles,
        label: "Admin intelligence"
      }
    );
  }

  return commands;
}
