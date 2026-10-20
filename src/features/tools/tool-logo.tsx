"use client";

import { useState } from "react";
import Image from "next/image";

type ToolLogoProps = {
  className?: string;
  logoUrl: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "h-8 w-8 rounded-full text-[0.7rem]",
  md: "h-11 w-11 rounded-full text-sm",
  lg: "h-16 w-16 rounded-[1.1rem] text-lg",
  xl: "h-20 w-20 rounded-[1.4rem] text-2xl md:h-24 md:w-24 md:rounded-[1.6rem]"
};

const paddingClasses = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2.5",
  xl: "p-3 md:p-3.5"
};

export function ToolLogo({ className, logoUrl, name, size = "md" }: ToolLogoProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logoUrl) && !failed;

  return (
    <span
      className={[
        "relative flex shrink-0 items-center justify-center overflow-hidden font-display font-bold tracking-[-0.03em]",
        showImage ? "bg-white ring-1 ring-ink/[0.08]" : "bg-ink text-paper",
        sizeClasses[size],
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showImage ? (
        <Image
          alt={`${name} logo`}
          className={`h-full w-full object-contain ${paddingClasses[size]}`}
          fill
          loading="eager"
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
          sizes="96px"
          src={logoUrl as string}
          unoptimized
        />
      ) : (
        <span aria-hidden="true">{initialsFor(name)}</span>
      )}
    </span>
  );
}

function initialsFor(name: string) {
  const words = name
    .replace(/[^\dA-Za-z ]/g, " ")
    .split(" ")
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
