export type CommandSearchItemType =
  | "tool"
  | "use-case"
  | "industry"
  | "opportunity"
  | "playbook";

export type CommandSearchItem = {
  description?: string | null;
  href: string;
  id: string;
  label: string;
  type: CommandSearchItemType;
};

export type CommandSearchGroup = {
  heading: string;
  items: CommandSearchItem[];
};

export type CommandSearchResponse = {
  groups: CommandSearchGroup[];
};
