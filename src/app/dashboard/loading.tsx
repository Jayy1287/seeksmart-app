import {
  LoadingFrame,
  SkeletonBlock,
  SkeletonLine
} from "@/components/state-surfaces";

export default function DashboardLoading() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <LoadingFrame
          className="grid gap-6 lg:grid-cols-[260px_1fr]"
          label="Loading workspace"
        >
          <aside className="workspace-sidebar rounded-2xl p-5">
            <SkeletonLine className="h-8 w-32" />
            <SkeletonLine className="mt-5 h-4 w-full" />
            <SkeletonLine className="mt-2 h-4 w-5/6" />
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonBlock className="h-11 rounded-xl" key={index} />
              ))}
            </div>
          </aside>
          <section className="grid gap-6">
            <div className="workspace-hero rounded-2xl p-6">
              <SkeletonLine className="h-8 w-36" />
              <SkeletonLine className="mt-5 h-11 w-full max-w-xl" />
              <SkeletonLine className="mt-4 h-4 w-full max-w-2xl" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <SkeletonBlock className="h-24 rounded-xl" key={index} />
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <SkeletonBlock className="h-80 rounded-2xl" />
              <SkeletonBlock className="h-80 rounded-2xl" />
            </div>
          </section>
        </LoadingFrame>
      </div>
    </main>
  );
}
