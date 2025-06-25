interface AmericanaPreviewProps {
  color: string;
}

export default function AmericanaPreview({ }: AmericanaPreviewProps) {
  return (
    <>
      {/* Header */}
      <div className="h-16 mb-8 flex items-center justify-between px-8 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded" />
          <div className="w-24 h-3 bg-black rounded" />
        </div>
        <div className="flex gap-6">
          <div className="w-16 h-2 bg-gray-300 rounded" />
          <div className="w-16 h-2 bg-gray-300 rounded" />
          <div className="w-16 h-2 bg-gray-300 rounded" />
        </div>
      </div>
      
      {/* Hero section */}
      <div className="px-8 mb-12">
        <div className="h-64 bg-black rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-8 bg-white/20 rounded mb-4 mx-auto" />
              <div className="w-48 h-4 bg-white/10 rounded mx-auto" />
            </div>
          </div>
          {/* Decorative frame */}
          <div className="absolute inset-4 border-2 border-white/20 rounded" />
        </div>
      </div>
      
      {/* Art grid */}
      <div className="px-8 grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square relative">
            <div className="w-full h-full bg-gray-100 rounded" />
            <div className="absolute inset-2 bg-gray-200 rounded" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-b flex items-center px-2">
              <div className="w-full h-1 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA section */}
      <div className="px-8">
        <div className="h-12 bg-black rounded flex items-center justify-center">
          <div className="w-32 h-2 bg-white/80 rounded" />
        </div>
      </div>
    </>
  );
}