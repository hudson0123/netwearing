export default function ShirtMockup() {
  return (
    <div className="relative w-[200px] h-[240px]">
      {/* Sleeves */}
      <div className="absolute top-[38px] left-0 w-8 h-[70px] bg-[#1a1a2e] rounded origin-top-right -rotate-[8deg]" />
      <div className="absolute top-[38px] right-0 w-8 h-[70px] bg-[#1a1a2e] rounded origin-top-left rotate-[8deg]" />

      {/* Collar pieces */}
      <div className="absolute top-0 left-5 w-[60px] h-[50px] bg-[#1a1a2e] rounded-bl-lg" />
      <div className="absolute top-0 right-5 w-[60px] h-[50px] bg-[#1a1a2e] rounded-br-lg" />

      {/* Body */}
      <div className="absolute bottom-0 left-5 right-5 top-10 bg-[#1a1a2e] rounded-b-lg" />

      {/* Neck cutout */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[30px] bg-bg rounded-b-[50%] z-10" />

      {/* Name on shirt */}
      <div className="absolute top-[90px] left-1/2 -translate-x-1/2 text-white font-serif text-lg font-bold whitespace-nowrap tracking-wider z-20">
        JOHN DOE
      </div>

      {/* Title on shirt */}
      <div className="absolute top-[115px] left-1/2 -translate-x-1/2 text-[#70b5f9] text-[0.55rem] font-semibold whitespace-nowrap z-20 tracking-wide">
        SENIOR SYNERGY OFFICER · 8 YRS EXP
      </div>

      {/* Resume lines */}
      <div className="absolute top-[135px] left-1/2 -translate-x-1/2 flex flex-col gap-[3px] z-20 w-[120px]">
        <div className="h-[3px] bg-white/50 rounded-sm" />
        <div className="h-[2px] bg-white/25 rounded-sm" />
        <div className="h-[2px] bg-white/25 rounded-sm w-[60%]" />
        <div className="h-[3px] bg-white/50 rounded-sm mt-1" />
        <div className="h-[2px] bg-white/25 rounded-sm" />
        <div className="h-[2px] bg-white/25 rounded-sm" />
        <div className="h-[2px] bg-white/25 rounded-sm w-[60%]" />
        <div className="h-[3px] bg-white/50 rounded-sm mt-1" />
        <div className="h-[2px] bg-white/25 rounded-sm" />
        <div className="h-[2px] bg-white/25 rounded-sm w-[60%]" />
      </div>
    </div>
  );
}
