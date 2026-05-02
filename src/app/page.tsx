import { ArrowRight, Filter, Gauge, ShieldCheck } from "lucide-react";

const categories = [
  "Writing",
  "Productivity",
  "Image generation",
  "Video",
  "Developer tools",
  "Marketing"
];

const principles = [
  {
    icon: Gauge,
    title: "Fast discovery",
    description: "Search, filter, and compare tools without wading through noise."
  },
  {
    icon: Filter,
    title: "Structured data",
    description: "Categories, use cases, pricing, and alternatives are modeled cleanly."
  },
  {
    icon: ShieldCheck,
    title: "Moderated listings",
    description: "Submitted tools go through review before they become public."
  }
];

export default function Home() {
  return (
    <main>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-4 text-sm font-medium uppercase text-accent">
              AI tool discovery
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-ink md:text-6xl">
              Find the right AI tool in seconds.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              SeekSmart is being built as a clean, SEO-first directory for
              discovering AI tools by category, use case, pricing, and
              alternatives.
            </p>
            <form className="mt-8 flex max-w-2xl gap-3">
              <input
                className="min-h-12 flex-1 rounded-md border border-line bg-white px-4 text-base outline-none transition focus:border-accent"
                placeholder="Search for writing, video, coding..."
                type="search"
              />
              <button
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 font-medium text-paper"
                type="submit"
              >
                Search
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </form>
          </div>
          <div className="rounded-md border border-line bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Popular categories</h2>
              <span className="text-sm text-ink/50">MVP seed</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <a
                  className="rounded-md border border-line px-4 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
                  href="/categories"
                  key={category}
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;

          return (
            <article className="rounded-md border border-line bg-white p-5" key={principle.title}>
              <Icon aria-hidden="true" className="mb-4 text-accent" size={22} />
              <h2 className="font-semibold">{principle.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                {principle.description}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
