export default function AboutSection() {
	return (
		<section id="about" className="h-screen bg-white flex items-center justify-center px-4 py-8 relative">
			{/* Personal info in top left */}
			<div className="absolute top-8 left-8 text-left">
				<h3 className="text-xl font-bold tracking-normal text-[#0a0a0a] mb-2">MATTHEW ABRAHAM</h3>
				<p className="text-base font-bold tracking-normal text-gray-600 mb-2">28 YEARS OLD</p>
				<div className="flex items-center gap-2">
					<span className="text-base font-bold tracking-normal text-gray-600">BASED IN</span>
					<div className="flex gap-1">
						{/* Trinidad & Tobago */}
						<span className="text-lg" title="Trinidad and Tobago">🇹🇹</span>
						{/* Turks and Caicos */}
						<span className="text-lg" title="Turks and Caicos">🇹🇨</span>
						{/* St Vincent and the Grenadines */}
						<span className="text-lg" title="St Vincent and the Grenadines">🇻🇨</span>
						{/* Belize */}
						<span className="text-lg" title="Belize">🇧🇿</span>
						{/* United Kingdom */}
						<span className="text-lg" title="United Kingdom">🇬🇧</span>
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto text-center">
				{/* Coding text */}
				<h2 className="text-2xl font-bold tracking-normal text-[#0a0a0a] mb-24">
					I'VE BEEN CODING FOR 6 YEARS AND...
				</h2>

				<blockquote className="relative">
					{/* Main quote */}
					<p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0a0a0a] leading-relaxed relative z-10">
						Venture capitalists pitch{" "}
						<span className="text-gray-500">"banking the unbanked"</span> —{" "}
						<span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              I've actually done it
            </span>
					</p>
				</blockquote>
			</div>
		</section>
	);
}