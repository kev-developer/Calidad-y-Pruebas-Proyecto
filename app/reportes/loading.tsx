export default function Loading() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
        <div className="h-12 bg-slate-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded"></div>
          <div className="h-80 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
