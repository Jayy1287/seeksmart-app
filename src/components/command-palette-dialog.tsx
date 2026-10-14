"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { capturePostHogEvent } from "@/features/analytics/posthog-client";
import "@/styles/content.css";
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
  Sparkles,
  ArrowRight,
  CornerDownLeft
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
      className="flex max-h-[min(34rem,calc(100dvh-6rem))] flex-col"
      contentClassName="ss-palette fixed left-1/2 top-[max(1rem,12vh)] z-[100] w-[calc(100vw-1.5rem)] max-w-[40rem] -translate-x-1/2 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper shadow-[0_40px_120px_-30px_rgb(14_14_16/0.55)] outline-none"
      label="SeekSmart command palette"
      loop
      onOpenChange={onOpenChange}
      open={isOpen}
      overlayClassName="ss-palette-overlay fixed inset-0 z-[99] bg-night/40 backdrop-blur-md"
      shouldFilter
    >
      <Dialog.Title className="sr-only">SeekSmart command palette</Dialog.Title>
      <Dialog.Description className="sr-only">
        Search and open SeekSmart pages, tools, use cases, industries, playbooks,
        dashboards, and admin shortcuts.
      </Dialog.Description>
      <div className="flex items-center gap-3 border-b border-ink/10 px-5">
        <Search aria-hidden="true" className="shrink-0 text-ink/40" size={20} />
        <Command.Input
          autoFocus
          className="h-16 min-w-0 flex-1 bg-transparent font-display text-xl tracking-[-0.02em] outline-none focus-visible:outline-none placeholder:text-ink/35 md:text-[1.4rem]"
          onValueChange={setQuery}
          placeholder="Search pages, tools, use cases"
          value={query}
        />
        {isPending ? (
          <span aria-hidden="true" className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-signal" />
        ) : null}
        <span className="kbd hidden shrink-0 sm:inline-flex">Esc</span>
      </div>
      <Command.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2 pt-1 [scrollbar-width:thin]">
        <Command.Empty className="px-4 py-12 text-center">
          <span className="font-display text-xl font-bold tracking-[-0.03em]">Nothing found.</span>
          <span className="mt-1 block text-sm text-ink/50">Try a tool name or a task.</span>
        </Command.Empty>
        <Command.Group className={groupClass} heading="Go to">
          {staticCommands.map((command) => {
            const Icon = command.icon;

            return (
              <Command.Item
                className={itemClass}
                key={command.href}
                onSelect={() => openHref(command.href, command.label, "static")}
                value={`${command.label} ${command.description}`}
              >
                <span className={iconClass}>
                  <Icon aria-hidden="true" size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{command.label}</span>
                  <span className="block truncate text-[0.8rem] text-ink/50 group-data-[selected=true]/item:text-paper/55">{command.description}</span>
                </span>
                <CornerDownLeft aria-hidden="true" className={enterClass} size={15} />
              </Command.Item>
            );
          })}
        </Command.Group>
        {isPending ? (
          <Command.Loading className="px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/40">
            Searching
          </Command.Loading>
        ) : null}
        {groups.map((group) => (
          <Command.Group
            className={groupClass}
            heading={group.heading}
            key={group.heading}
          >
            {group.items.map((item) => (
              <Command.Item
                className={itemClass}
                key={`${item.type}-${item.id}`}
                onSelect={() => openHref(item.href, item.label, item.type)}
                value={`${item.label} ${item.description ?? ""} ${item.type}`}
              >
                <span className={iconClass}>
                  <ArrowRight aria-hidden="true" size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.label}</span>
                  <span className="block truncate text-[0.8rem] text-ink/50 group-data-[selected=true]/item:text-paper/55">{item.description ?? item.href}</span>
                </span>
                <CornerDownLeft aria-hidden="true" className={enterClass} size={15} />
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
      <div className="hidden items-center gap-4 border-t border-ink/10 bg-ink/[0.03] px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink/45 sm:flex">
        <span className="flex items-center gap-1.5">
          <span className="kbd">↑</span>
          <span className="kbd">↓</span>
          Move
        </span>
        <span className="flex items-center gap-1.5">
          <span className="kbd">↵</span>
          Open
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          SeekSmart
        </span>
      </div>
    </Command.Dialog>
  );
}

const groupClass =
  "pt-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.68rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-ink/40";

const itemClass =
  "group/item relative flex min-h-[3.25rem] cursor-pointer select-none items-center gap-3 rounded-2xl px-3 py-2 text-[0.95rem] text-ink/80 transition-colors duration-150 data-[selected=true]:bg-ink data-[selected=true]:text-paper data-[disabled=true]:opacity-40";

const iconClass =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink/[0.05] text-ink/60 transition-colors duration-150 group-data-[selected=true]/item:bg-signal group-data-[selected=true]/item:text-white";

const enterClass =
  "shrink-0 opacity-0 transition-opacity duration-150 group-data-[selected=true]/item:opacity-60";

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
      href: "/audit/questions",
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
