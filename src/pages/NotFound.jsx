import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const goToPortal = () => {
    navigate('/disaster-portal');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#060A10] via-[#09111E] to-[#03060B] relative overflow-hidden flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      
      {/* Background Grid & Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] bg-size-[40px_40px] opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Ocean & Disaster Icons Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-3xl animate-pulse-slow opacity-25">🌊</div>
        <div className="absolute top-[20%] right-[8%] text-2xl animate-spin-slow opacity-20">🌀</div>
        <div className="absolute bottom-[30%] left-[10%] text-4xl animate-bounce-slow opacity-20">🚨</div>
        <div className="absolute top-[60%] right-[15%] text-3xl animate-float opacity-20">⚡</div>
        <div className="absolute bottom-[15%] right-[20%] text-2xl animate-pulse-slow opacity-15">⚓</div>
        <div className="absolute top-[40%] left-[15%] text-3xl animate-float-delayed opacity-20">🚁</div>
        <div className="absolute bottom-[50%] right-[25%] text-2xl opacity-15">🛡️</div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl w-full bg-[#0D1526]/85 backdrop-blur-md rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {/* LEFT SIDE - Coastal Disaster Theme Illustration */}
          <div className="lg:w-1/2 bg-linear-to-br from-[#09111E] to-[#040810] p-8 md:p-12 flex items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1E293B]">
            
            {/* Radar / Wave Line Animation Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute">
                <path d="M0 100 L40 100 L50 40 L65 160 L80 70 L95 130 L110 90 L125 110 L140 100 L400 100" fill="none" stroke="#06B6D4" strokeWidth="2">
                  <animate attributeName="stroke-dashoffset" values="400;0" dur="3s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>

            <div className="relative text-center w-full">
              {/* 3D Numbers with Water/Cyan Styling */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-[110px] md:text-[160px] font-black text-transparent bg-clip-text bg-linear-to-b from-cyan-400 to-blue-700 drop-shadow-2xl animate-float">4</span>
                <span className="text-[110px] md:text-[160px] font-black text-transparent bg-clip-text bg-linear-to-b from-teal-300 to-cyan-600 drop-shadow-2xl animate-float-delayed relative">
                  0
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-cyan-400/30 rounded-full animate-ping"></div>
                  </div>
                </span>
                <span className="text-[110px] md:text-[160px] font-black text-transparent bg-clip-text bg-linear-to-b from-cyan-400 to-blue-700 drop-shadow-2xl animate-float">4</span>
              </div>

              {/* Disaster Management Equipment Grid */}
              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-8">
                <div className="bg-[#131F33] p-3 rounded-xl border border-[#233554] flex flex-col items-center justify-center animate-pulse-slow">
                  <span className="text-xl">📡</span>
                  <span className="text-[10px] text-cyan-400 mt-1 font-medium">Tsunami</span>
                </div>
                <div className="bg-[#131F33] p-3 rounded-xl border border-[#233554] flex flex-col items-center justify-center animate-bounce-slow">
                  <span className="text-xl">🚁</span>
                  <span className="text-[10px] text-orange-400 mt-1 font-medium">Rescue</span>
                </div>
                <div className="bg-[#131F33] p-3 rounded-xl border border-[#233554] flex flex-col items-center justify-center animate-float">
                  <span className="text-xl">🛡️</span>
                  <span className="text-[10px] text-yellow-400 mt-1 font-medium">Sandbag</span>
                </div>
                <div className="bg-[#131F33] p-3 rounded-xl border border-[#233554] flex flex-col items-center justify-center animate-float-delayed">
                  <span className="text-xl">🚨</span>
                  <span className="text-[10px] text-red-400 mt-1 font-medium">Evacuate</span>
                </div>
                <div className="bg-[#131F33] p-3 rounded-xl border border-[#233554] flex flex-col items-center justify-center animate-pulse-slow">
                  <span className="text-xl">🛰️</span>
                  <span className="text-[10px] text-blue-400 mt-1 font-medium">Weather</span>
                </div>
                <div className="bg-[#131F33] p-3 rounded-xl border border-[#233554] flex flex-col items-center justify-center animate-bounce-slow">
                  <span className="text-xl">📊</span>
                  <span className="text-[10px] text-teal-400 mt-1 font-medium">Gauge</span>
                </div>
              </div>

              {/* Emergency Beacon Pulse */}
              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                SECTOR DISCONNECTED / NO SIGNAL
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Content & Navigation */}
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between">
            <div>
              {/* Project Branding */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-white text-lg">⚓</span>
                </div>
                <span className="text-white font-bold text-xl tracking-tight">CoastalGuard System</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Region Submerged or Not Mapped</h1>
              
              {/* Message */}
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                The coordinates you are seeking are currently unavailable due to a severe data disruption. 
                The path may be blocked by debris or an active evacuation order.
              </p>

              {/* Coastal Disaster Analogies */}
              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="text-cyan-400">🌊</span>
                  <span>Like a breached seawall, we couldn't contain your request</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="text-blue-400">🛡️</span>
                  <span>This information may have been moved to a secure inland bunker</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="text-orange-400">⚠️</span>
                  <span>Our tracking arrays indicate this sector is under a 'Search & Rescue' protocol</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={goToHome}
                  className="flex-1 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm"
                >
                  <span>🏠</span>
                  Return to Safe Zone
                </button>
                <button 
                  onClick={goToPortal}
                  className="flex-1 bg-[#131F33] border border-[#233554] hover:bg-[#1a2b45] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <span>📡</span>
                  Launch Disaster Portal
                </button>
              </div>

              {/* Helpful Links */}
              <div className="mb-6">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Critical Navigation Links:</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/evacuation-routes'); }} className="text-slate-400 text-xs hover:text-cyan-400 transition flex items-center gap-2">
                    <span className="text-cyan-500 text-[10px]">▶</span> Review Evacuation Routes
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/weather-alerts'); }} className="text-slate-400 text-xs hover:text-cyan-400 transition flex items-center gap-2">
                    <span className="text-cyan-500 text-[10px]">▶</span> Check Weather Alert Status
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/emergency-contacts'); }} className="text-slate-400 text-xs hover:text-cyan-400 transition flex items-center gap-2">
                    <span className="text-cyan-500 text-[10px]">▶</span> Emergency Command Center
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shelter-map'); }} className="text-slate-400 text-xs hover:text-cyan-400 transition flex items-center gap-2">
                    <span className="text-cyan-500 text-[10px]">▶</span> Safe Shelter Map
                  </a>
                </div>
              </div>
            </div>

            {/* Emergency Hotline Footer */}
            <div className="bg-[#131F33]/60 border border-[#233554] rounded-xl p-3.5 flex items-center gap-3">
              <span className="text-red-500 text-lg animate-pulse">🚨</span>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[11px]">Coastal Emergency Hotline (24/7):</span>
                <strong className="text-white text-xs tracking-wide">+1-888-SAFE-COAST</strong>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 0.5s;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;