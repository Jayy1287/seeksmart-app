import {
  LoadingFrame,
  SkeletonBlock,
  SkeletonLine
} from "@/components/state-surfaces";

export default function ToolDetailLoading() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <LoadingFrame
          className="grid gap-6"
          label="Loading tool decision page"
        >
          <section className="surface-strong grid gap-8 rounded-2xl p-6 lg:grid-cols-[1fr_360px]">
            <div>
              <SkeletonLine className="h-4 w-44" />
              <div className="mt-6 flex items-center gap-4">
                <SkeletonBlock className="h-16 w-16 rounded-2xl" />
                <SkeletonLine className="h-12 w-64" />
              </div>
              <SkeletonLine className="mt-7 h-5 w-full max-w-3xl" />
              <SkeletonLine className="mt-3 h-5 w-full max-w-2xl" />
              <div className="mt-6 flex flex-wrap gap-2">
                <SkeletonBlock className="h-8 w-24 rounded-full" />
                <SkeletonBlock className="h-8 w-28 rounded-full" />
                <SkeletonBlock className="h-8 w-20 rounded-full" />
              </div>
            </div>
            <aside className="surface-panel rounded-xl p-5">
              <SkeletonLine className="h-5 w-40" />
              <SkeletonLine className="mt-4 h-4 w-full" />
              <SkeletonLine className="mt-2 h-4 w-5/6" />
              <div className="mt-6 grid gap-3">
                {Array.from({ length: 4 }, (_, index) => (
                  <SkeletonBlock className="h-10 rounded-lg" key={index} />
                ))}
              </div>
              <SkeletonBlock className="mt-6 h-12 rounded-full" />
            </aside>
          </section>
          <section className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonBlock className="h-24 rounded-xl" key={index} />
            ))}
          </section>
          <section className="surface-strong rounded-xl p-6">
            <SkeletonLine className="h-6 w-72" />
            <div className="mt-5 grid gap-3">
              {Array.from({ length: 5 }, (_, index) => (
                <SkeletonBlock className="h-16 rounded-xl" key={index} />
              ))}
            </div>
          </section>
        </LoadingFrame>
      </div>
    </main>
  );
}
