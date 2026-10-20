import {
  LoadingFrame,
  SkeletonBlock,
  SkeletonLine
} from "@/components/state-surfaces";
import { ToolRowsSkeleton } from "@/features/tools/tool-rows-skeleton";

export default function ToolDetailLoading() {
  return (
    <main>
      <LoadingFrame label="Loading tool">
        <section className="app-container page-hero grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center lg:gap-16">
          <div>
            <SkeletonLine className="h-3 w-40" />
            <SkeletonBlock className="mt-8 h-20 w-20 rounded-[1.4rem] md:h-24 md:w-24" />
            <SkeletonBlock className="mt-7 h-[clamp(3.1rem,6.6vw,6.6rem)] w-3/4" />
            <SkeletonLine className="mt-7 h-4 w-full max-w-xl" />
            <SkeletonLine className="mt-3 h-4 w-2/3 max-w-md" />
            <div className="mt-6 flex gap-2">
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-24 rounded-full" />
              <SkeletonBlock className="h-6 w-16 rounded-full" />
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <SkeletonBlock className="h-[3.4rem] w-44 rounded-full" />
              <SkeletonBlock className="h-[3.4rem] w-28 rounded-full" />
            </div>
          </div>
          <div className="rounded-[2rem] bg-ink/[0.06] p-6 sm:p-8">
            <div className="flex items-center gap-6">
              <div className="h-[148px] w-[148px] shrink-0 rounded-full border-[9px] border-ink/[0.07]" />
              <div className="flex-1">
                <SkeletonLine className="h-3 w-16" />
                <SkeletonLine className="mt-3 h-5 w-full" />
              </div>
            </div>
            <div className="mt-8 grid gap-5">
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonLine className="h-3 w-full" key={index} />
              ))}
            </div>
          </div>
        </section>
        <section className="app-container pb-20">
          <SkeletonBlock className="aspect-[16/10] w-full rounded-[1.25rem] md:rounded-[1.75rem]" />
        </section>
        <section className="app-container pb-24">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonBlock className="mb-10 mt-5 h-12 w-72 max-w-full" />
          <ToolRowsSkeleton count={4} />
        </section>
      </LoadingFrame>
    </main>
  );
}
