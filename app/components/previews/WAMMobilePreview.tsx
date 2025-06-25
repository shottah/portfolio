interface WAMMobilePreviewProps {
  color: string;
  yellowColor: string;
}

export default function WAMMobilePreview({ color, yellowColor }: WAMMobilePreviewProps) {
  return (
    <>
      {/* App header */}
      <div className="flex items-center justify-between mb-6">
        {/* Hamburger menu */}
        <div className="w-6 h-6 flex flex-col justify-center gap-1">
          <div className="w-5 h-0.5 bg-gray-700" />
          <div className="w-5 h-0.5 bg-gray-700" />
          <div className="w-5 h-0.5 bg-gray-700" />
        </div>
        <h3 className="text-xs font-semibold" style={{ color }}>@matthew</h3>
        {/* Purple circle */}
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
      </div>
      
      {/* Balance card */}
      <div 
        className="rounded-xl p-4 mb-4 text-white relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <p className="text-xs opacity-80 mb-1">Total Balance</p>
        <p className="text-2xl font-bold mb-3">TT$1,250.00</p>
        <div className="flex gap-2">
          <div className="rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: yellowColor, color }}>TTD</div>
          <div className="bg-white/20 rounded px-3 py-1 text-xs">USD</div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full" style={{ backgroundColor: yellowColor, opacity: 0.2 }} />
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gray-100">
          <div className="w-6 h-6 rounded mb-1" style={{ backgroundColor: yellowColor }} />
          <span className="text-[10px] text-gray-700">Send</span>
        </div>
        <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gray-100">
          <div className="w-6 h-6 rounded mb-1" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-gray-700">Request</span>
        </div>
        <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gray-100">
          <div className="w-6 h-6 rounded mb-1" style={{ backgroundColor: yellowColor }} />
          <span className="text-[10px] text-gray-700">QR Pay</span>
        </div>
      </div>
      
      {/* Recent transactions */}
      <div>
        <p className="text-xs font-semibold mb-2 text-gray-800">Recent Activity</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <p className="text-xs font-medium text-gray-800">John Smith</p>
                <p className="text-[10px] text-gray-500">2 hours ago</p>
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color }}>+TT$250</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <p className="text-xs font-medium text-gray-800">Grocery Store</p>
                <p className="text-[10px] text-gray-500">Yesterday</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700">-TT$150</span>
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white">
        <div className="flex h-full p-3 gap-3">
          <div className="flex-1 rounded-xl" style={{ backgroundColor: color }} />
          <div className="flex-1 rounded-xl" style={{ backgroundColor: yellowColor }} />
        </div>
      </div>
    </>
  );
}