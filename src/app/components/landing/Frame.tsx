interface Props {
  children: React.ReactNode
}

export default function Frame(props: Props) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] dark:bg-slate-800">
      <div className="flex h-9 flex-row bg-slate-800 p-3 dark:bg-slate-950" id="header">
        <div className="flex h-full flex-grow flex-row space-x-2" id="buttons">
          <div className="aspect-square h-full rounded-full bg-[#ee6750]"></div>
          <div className="aspect-square h-full rounded-full bg-[#f5b93c]"></div>
          <div className="aspect-square h-full rounded-full bg-[#4eb844]"></div>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center p-3">{props.children}</div>
    </div>
  )
}
