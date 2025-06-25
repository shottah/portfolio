interface DefaultPreviewProps {
  color: string;
}

export default function DefaultPreview({ color }: DefaultPreviewProps) {
  return (
    <div 
      className="w-full h-full relative"
      style={{ 
        backgroundColor: `${color}10`,
        border: `1px solid rgba(255, 255, 255, 0.2)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-3/4 h-3/4 rounded"
          style={{ backgroundColor: `${color}20` }}
        />
      </div>
      <div className="absolute top-4 left-4 w-1/3 h-1 rounded-full" style={{ backgroundColor: color }} />
      <div className="absolute top-8 left-4 w-1/4 h-1 rounded-full opacity-50" style={{ backgroundColor: color }} />
      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full opacity-20" style={{ backgroundColor: color }} />
    </div>
  );
}