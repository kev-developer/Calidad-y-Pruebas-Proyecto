export default function Loading() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
          <div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
