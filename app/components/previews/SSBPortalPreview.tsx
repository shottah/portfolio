interface SSBPortalPreviewProps {
  color: string;
  goldColor: string;
}

export default function SSBPortalPreview({ color, goldColor }: SSBPortalPreviewProps) {
  return (
    <>
      {/* Header */}
      <div className="h-12 rounded mb-4 flex items-center justify-between px-4" style={{ backgroundColor: color }}>
        <div className="w-32 h-6 bg-white/20 rounded" />
        <div className="flex gap-2">
          <div className="w-20 h-6 rounded" style={{ backgroundColor: goldColor }} />
          <div className="w-16 h-6 bg-white/20 rounded" />
        </div>
      </div>
      
      {/* Hero section */}
      <div className="mb-6">
        <div className="h-32 rounded flex items-center justify-center mb-4" style={{ background: `linear-gradient(to right, ${color}10, ${color}20)` }}>
          <div className="text-center">
            <div className="w-48 h-4 bg-gray-300 rounded mb-2 mx-auto" />
            <div className="w-32 h-3 bg-gray-200 rounded mx-auto" />
            <div className="w-24 h-8 rounded mt-4 mx-auto" style={{ backgroundColor: goldColor }} />
          </div>
        </div>
      </div>
      
      {/* Content grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded p-3">
            <div className="w-12 h-12 rounded mb-2" style={{ backgroundColor: i === 2 ? goldColor : `${color}30` }} />
            <div className="w-full h-2 bg-gray-200 rounded mb-1" />
            <div className="w-3/4 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      
      {/* Footer indicator */}
      <div className="h-8 rounded flex items-center px-4" style={{ backgroundColor: color }}>
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: goldColor }} />
          <div className="w-16 h-2 bg-white/20 rounded" />
        </div>
      </div>
    </>
  );
}