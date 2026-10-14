import type { Config } from "tailwindcss";

const color = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: color("ink"),
        paper: color("paper"),
        line: color("line"),
        accent: color("accent"),
        signal: color("signal"),
        success: color("success"),
        warning: color("warning"),
        danger: color("danger"),
        secondary: color("secondary"),
        surface: color("surface"),
        muted: color("muted"),
        brand: color("brand"),
        warm: color("warm"),
        night: color("night"),
        "night-2": color("night-2"),
        "primary-light": color("primary-light"),
        "muted-text": color("muted-text")
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;
