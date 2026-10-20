import {
  LoadingFrame,
  SkeletonBlock,
  SkeletonLine
} from "@/components/state-surfaces";

export default function DashboardLoading() {
  return (
    <main>
      <LoadingFrame className="app-container page-hero" label="Loading workspace">
        <SkeletonLine className="h-3 w-28" />
        <SkeletonLine className="mt-7 h-14 w-full max-w-xl" />
        <SkeletonLine className="mt-3 h-14 w-full max-w-md" />
        <div className="mt-14 grid max-w-xl grid-cols-2 gap-6">
          {Array.from({ length: 2 }, (_, index) => (
            <div className="border-t border-ink/15 pt-4" key={index}>
              <SkeletonLine className="h-14 w-20" />
              <SkeletonLine className="mt-3 h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="mt-20">
          <SkeletonLine className="h-10 w-56" />
          <div className="mt-8 border-t border-ink/[0.12]">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                className="flex items-center gap-4 border-b border-ink/[0.12] py-5"
                key={index}
              >
                <SkeletonBlock className="h-14 w-14 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <SkeletonLine className="h-5 w-full max-w-sm" />
                  <SkeletonLine className="mt-2 h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </LoadingFrame>
    </main>
  );
}
