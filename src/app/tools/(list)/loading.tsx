import {
  LoadingFrame,
  SkeletonBlock,
  SkeletonLine
} from "@/components/state-surfaces";
import { ToolRowsSkeleton } from "@/features/tools/tool-rows-skeleton";

export default function ToolsLoading() {
  return (
    <main>
      <LoadingFrame label="Loading tool directory">
        <section className="app-container page-hero">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="w-full max-w-2xl">
              <SkeletonLine className="h-3 w-32" />
              <SkeletonBlock className="mt-7 h-[clamp(2.4rem,5.6vw,4.9rem)] w-4/5" />
              <SkeletonBlock className="mt-3 h-[clamp(2.4rem,5.6vw,4.9rem)] w-full" />
              <SkeletonLine className="mt-7 h-4 w-72 max-w-full" />
            </div>
            <div className="md:text-right">
              <SkeletonBlock className="h-20 w-36 md:ml-auto" />
              <SkeletonLine className="mt-3 h-3 w-24 md:ml-auto" />
            </div>
          </div>
        </section>
        <section className="app-container pb-24">
          <div className="flex flex-col gap-3 md:flex-row">
            <SkeletonBlock className="h-14 flex-1 rounded-full" />
            <SkeletonBlock className="h-11 w-72 max-w-full rounded-full" />
          </div>
          <div className="mt-4 flex gap-2 overflow-hidden">
            {Array.from({ length: 9 }, (_, index) => (
              <SkeletonBlock className="h-[2.1rem] w-28 shrink-0 rounded-full" key={index} />
            ))}
          </div>
          <SkeletonLine className="mb-6 mt-14 h-3 w-28" />
          <ToolRowsSkeleton count={8} />
        </section>
      </LoadingFrame>
    </main>
  );
}
