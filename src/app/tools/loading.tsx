import {
  LoadingFrame,
  SkeletonBlock,
  SkeletonLine
} from "@/components/state-surfaces";

export default function ToolsLoading() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <LoadingFrame label="Loading tool directory">
          <div className="mb-8 border-b border-line/50 pb-8">
            <SkeletonLine className="h-8 w-36" />
            <SkeletonLine className="mt-5 h-10 w-full max-w-xl" />
            <SkeletonLine className="mt-4 h-4 w-full max-w-2xl" />
          </div>
          <div className="grid gap-3 rounded-[1.35rem] border border-line/60 bg-white/45 p-3 md:grid-cols-[1fr_190px_170px]">
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
          </div>
          <div className="mt-7 grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonToolCard key={index} />
            ))}
          </div>
        </LoadingFrame>
      </div>
    </main>
  );
}

function SkeletonToolCard() {
  return (
    <div className="decision-card tool-decision-card min-h-[19rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3">
          <SkeletonBlock className="h-11 w-11 rounded-xl" />
          <div className="flex-1">
            <SkeletonLine className="h-3 w-14" />
            <SkeletonLine className="mt-3 h-5 w-36" />
            <SkeletonLine className="mt-2 h-3 w-24" />
          </div>
        </div>
        <SkeletonBlock className="h-14 w-16" />
      </div>
      <SkeletonLine className="mt-6 h-4 w-28" />
      <SkeletonLine className="mt-5 h-4 w-full" />
      <SkeletonLine className="mt-3 h-4 w-5/6" />
      <SkeletonLine className="mt-8 h-1 w-full" />
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line/40 pt-4">
        <SkeletonBlock className="h-9 w-24 rounded-full" />
        <SkeletonLine className="h-4 w-20" />
      </div>
    </div>
  );
}
