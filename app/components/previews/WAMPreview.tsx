interface WAMPreviewProps {
  color: string;
  yellowColor: string;
}

export default function WAMPreview({ color, yellowColor }: WAMPreviewProps) {
  return (
    <>
      {/* Header */}
      <div className="h-14 mb-6 flex items-center justify-between px-6" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: yellowColor }} />
          <div className="w-20 h-4 bg-white/30 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="w-16 h-8 rounded-full bg-white/20" />
          <div className="w-16 h-8 rounded-full" style={{ backgroundColor: yellowColor }} />
        </div>
      </div>
      
      {/* Hero section */}
      <div className="px-6 mb-8">
        <div className="h-48 rounded-2xl p-6 text-white relative overflow-hidden" style={{ backgroundColor: color }}>
          <div className="relative z-10">
            <div className="w-48 h-6 bg-white/30 rounded mb-3" />
            <div className="w-32 h-4 bg-white/20 rounded mb-6" />
            <div className="flex gap-3">
              <div className="w-24 h-10 rounded-full" style={{ backgroundColor: yellowColor }} />
              <div className="w-24 h-10 rounded-full border-2 border-white/30" />
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full" style={{ backgroundColor: yellowColor, opacity: 0.2 }} />
          <div className="absolute -right-12 bottom-0 w-24 h-24 rounded-full" style={{ backgroundColor: yellowColor, opacity: 0.1 }} />
        </div>
      </div>
      
      {/* Features grid */}
      <div className="px-6 grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-2" style={{ backgroundColor: i === 2 ? yellowColor : `${color}20` }} />
            <div className="w-full h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      
      {/* CTA section */}
      <div className="px-6">
        <div className="h-20 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: color }} />
            <div className="w-32 h-3 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </>
  );
}