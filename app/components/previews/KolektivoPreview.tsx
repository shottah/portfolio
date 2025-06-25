interface KolektivoPreviewProps {
  color: string;
  secondaryColor: string;
}

export default function KolektivoPreview({ color, secondaryColor }: KolektivoPreviewProps) {
  return (
    <>
      {/* Header */}
      <div className="h-12 mb-6 flex items-center justify-between px-4">
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color }} />
        <div className="flex gap-4">
          <div className="w-16 h-2 bg-gray-300 rounded" />
          <div className="w-16 h-2 bg-gray-300 rounded" />
          <div className="w-16 h-2 bg-gray-300 rounded" />
        </div>
      </div>
      
      {/* Hero with large text */}
      <div className="mb-8 px-4">
        <div className="w-64 h-6 bg-gray-900 rounded mb-2" />
        <div className="w-48 h-4" style={{ backgroundColor: color, opacity: 0.8 }} />
      </div>
      
      {/* Minimalist content blocks */}
      <div className="grid grid-cols-2 gap-6 mb-8 px-4">
        <div className="space-y-3">
          <div className="w-full h-24 rounded" style={{ backgroundColor: secondaryColor }} />
          <div className="w-3/4 h-2 bg-gray-300 rounded" />
          <div className="w-1/2 h-2 bg-gray-300 rounded" />
        </div>
        <div className="space-y-3">
          <div className="w-full h-24 rounded" style={{ backgroundColor: secondaryColor }} />
          <div className="w-3/4 h-2 bg-gray-300 rounded" />
          <div className="w-1/2 h-2 bg-gray-300 rounded" />
        </div>
      </div>
      
      {/* Partners section */}
      <div className="px-4">
        <div className="h-12 rounded flex items-center justify-center gap-4 px-4" style={{ backgroundColor: secondaryColor }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded" style={{ backgroundColor: i === 2 ? color : '#ccc' }} />
          ))}
        </div>
      </div>
    </>
  );
}