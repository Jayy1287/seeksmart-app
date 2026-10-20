import { SkeletonBlock, SkeletonLine } from "@/components/state-surfaces";

export function ToolRowsSkeleton({ count }: { count: number }) {
  return (
    <div className="border-t border-ink/10">
      {Array.from({ length: count }, (_, index) => (
        <div
          className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-ink/10 py-6 md:grid-cols-[3rem_minmax(0,1fr)_9.5rem_6.5rem_3.5rem] md:gap-x-6"
          key={index}
        >
          <SkeletonBlock className="h-11 w-11 rounded-full" />
          <div>
            <SkeletonLine className="h-5 w-40 max-w-full" />
            <SkeletonLine className="mt-2.5 h-3 w-full max-w-md" />
          </div>
          <SkeletonLine className="hidden h-3 w-24 md:block" />
          <SkeletonBlock className="hidden h-6 w-16 rounded-full md:block" />
          <SkeletonBlock className="h-[46px] w-[46px] rounded-full" />
        </div>
      ))}
    </div>
  );
}
