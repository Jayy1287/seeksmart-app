"use client";

import { useState } from "react";
import Image from "next/image";

type ToolLogoProps = {
  className?: string;
  logoUrl: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg"
};

export function ToolLogo({
  className,
  logoUrl,
  name,
  size = "md"
}: ToolLogoProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logoUrl) && !failed;

  return (
    <span
      className={[
        "tool-mark relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold ring-1 ring-line/40",
        sizeClasses[size],
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showImage ? (
        <Image
          alt={`${name} logo`}
          className="h-full w-full bg-white object-contain p-1.5"
          fill
          loading="eager"
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
          sizes="64px"
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
