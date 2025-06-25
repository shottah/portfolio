export default function NameSkeleton() {
  return (
    <div className="flex flex-col items-center min-h-[200px] relative">
      {/* Name placeholder */}
      <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider text-center leading-none w-fit m-0 p-0">
        <div className="m-0 p-0 opacity-0">MATTHEW</div>
        <div className="m-0 p-0 opacity-0">ABRAHAM</div>
      </div>
      
      {/* Adjectives placeholder */}
      <div className="relative overflow-hidden mt-2 min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] lg:min-h-[7rem] xl:min-h-[8rem] w-[800px] max-w-full">
        <div className="flex opacity-0 absolute">
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider mx-4 sm:mx-6 md:mx-8 whitespace-nowrap px-4 py-2">
            PLACEHOLDER
          </span>
        </div>
      </div>
    </div>
  );
}