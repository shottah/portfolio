interface KolektivoMobilePreviewProps {
  color: string;
  secondaryColor: string;
}

export default function KolektivoMobilePreview({ color, secondaryColor }: KolektivoMobilePreviewProps) {
  return (
    <>
      {/* App header */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-gray-800">Kolektivo</h3>
        <div className="w-6 h-6 rounded bg-gray-200" />
      </div>
      
      {/* Balance card */}
      <div 
        className="rounded-xl p-4 mb-4 text-white relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <p className="text-xs opacity-80 mb-1">Total Balance</p>
        <p className="text-2xl font-bold mb-3">$2,450.00</p>
        <div className="flex gap-2">
          <div className="bg-white/20 rounded px-2 py-1 text-xs">KTT</div>
          <div className="bg-white/20 rounded px-2 py-1 text-xs">cUSD</div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="aspect-square rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: secondaryColor }}>
          <div className="w-6 h-6 rounded mb-1" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-gray-700">Send</span>
        </div>
        <div className="aspect-square rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: secondaryColor }}>
          <div className="w-6 h-6 rounded mb-1" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-gray-700">Receive</span>
        </div>
        <div className="aspect-square rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: secondaryColor }}>
          <div className="w-6 h-6 rounded mb-1" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-gray-700">Impact</span>
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
                <p className="text-xs font-medium text-gray-800">Community Fund</p>
                <p className="text-[10px] text-gray-500">2 hours ago</p>
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color }}>+$125</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <p className="text-xs font-medium text-gray-800">Solar Project</p>
                <p className="text-[10px] text-gray-500">Yesterday</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700">-$50</span>
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white flex items-center justify-around">
        <div className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
        <div className="w-6 h-6 rounded bg-gray-300" />
        <div className="w-6 h-6 rounded bg-gray-300" />
        <div className="w-6 h-6 rounded bg-gray-300" />
      </div>
    </>
  );
}