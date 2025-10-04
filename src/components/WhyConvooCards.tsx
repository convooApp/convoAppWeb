export const WhyConvooCards = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating keyword bubbles */}
      <div className="absolute top-20 left-10 opacity-30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
        <span className="text-[#B83280] font-nunito font-light text-lg">chemistry</span>
      </div>
      
      <div className="absolute top-32 right-16 opacity-25 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
        <span className="text-white/60 font-nunito font-light text-base">no swiping</span>
      </div>
      
      <div className="absolute bottom-40 left-20 opacity-30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
        <span className="text-[#B83280]/70 font-nunito font-light text-lg">talk first</span>
      </div>
      
      <div className="absolute top-1/2 right-8 opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
        <span className="text-white/50 font-nunito font-light text-sm">real time</span>
      </div>
      
      <div className="absolute bottom-32 right-1/3 opacity-25 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
        <span className="text-[#B83280]/60 font-nunito font-light text-base">authentic</span>
      </div>
      
      <div className="absolute top-1/3 left-1/4 opacity-20 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4.2s' }}>
        <span className="text-white/40 font-nunito font-light text-sm">meaningful</span>
      </div>
    </div>
  );
};