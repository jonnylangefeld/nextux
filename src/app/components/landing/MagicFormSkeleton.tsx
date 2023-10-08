export default function MagicFormSkeleton() {
  return (
    <div className="flex w-full max-w-xl animate-pulse flex-col gap-y-2">
      <div className="flex flex-row items-start justify-between gap-x-3 sm:gap-x-16 lg:gap-x-32">
        <div className="flex w-full flex-col gap-y-2">
          <div className="h-9 w-full rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-9 w-[95%] rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-4 w-[80%] rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="aspect-square h-10 rounded-md bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div className="mt-10 flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-2">
          <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  )
}
