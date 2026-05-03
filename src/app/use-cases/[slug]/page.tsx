import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Target } from "lucide-react";
import { ToolCard } from "@/features/tools/tool-card";
import {
  getUseCaseBySlug,
  listToolsForUseCase
} from "@/server/use-cases/queries";

export const dynamic = "force-dynamic";

type UseCasePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);

  if (!useCase) {
    return {
      title: "Use case not found"
    };
  }

  const description =
    useCase.description ?? `Browse AI tools for ${useCase.name.toLowerCase()}.`;

  return {
    title: `${useCase.name} AI Tools`,
    description,
    alternates: {
      canonical: `/use-cases/${useCase.slug}`
    },
    openGraph: {
      title: `${useCase.name} AI Tools`,
      description,
      url: `/use-cases/${useCase.slug}`,
      type: "website"
    }
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const [useCase, tools] = await Promise.all([
    getUseCaseBySlug(slug),
    listToolsForUseCase(slug)
  ]);

  if (!useCase) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="app-container">
      <section className="surface-strong rounded-2xl p-6">
        <Link className="text-sm font-medium text-accent" href="/use-cases">
          Use cases
        </Link>
        <div className="mt-3 grid gap-6 md:grid-cols-[1fr_260px] md:items-end">
          <div>
            <h1 className="text-4xl font-semibold">
              {useCase.name} AI tools
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-ink/65">
              {useCase.description ??
                `Browse AI tools for ${useCase.name.toLowerCase()}.`}
            </p>
          </div>
          <div className="metric-tile rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Target aria-hidden="true" className="text-accent" size={18} />
              <span className="text-2xl font-semibold">
                {useCase.toolCount}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/55">Matching tools</p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        {tools.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Recommended tools</h2>
              <Link
                className="secondary-button"
                href="/tools"
              >
                Browse all tools
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        ) : (
          <div className="surface-panel rounded-xl p-8 text-center">
            <h2 className="font-semibold">No mapped tools yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
              This use case is ready for curated tool mappings.
            </p>
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
