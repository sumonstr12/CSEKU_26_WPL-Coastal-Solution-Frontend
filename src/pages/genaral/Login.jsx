import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login Data:', formData);
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#060A10] via-[#09111E] to-[#03060B] relative overflow-hidden flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      
      
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] bg-size-[40px_40px] opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[12%] left-[8%] text-3xl animate-pulse-slow opacity-25">🌊</div>
        <div className="absolute top-[25%] right-[10%] text-2xl animate-spin-slow opacity-20">🌀</div>
        <div className="absolute bottom-[20%] left-[12%] text-4xl animate-bounce-slow opacity-20">🛡️</div>
        <div className="absolute bottom-[15%] right-[15%] text-2xl animate-float opacity-20">🚁</div>
      </div>

      
      <div className="relative z-10 max-w-md w-full bg-[#0D1526]/90 backdrop-blur-md rounded-3xl border border-[#1E293B] shadow-2xl p-8 md:p-10">
        
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20 mb-4">
            <span className="text-white text-2xl">⚓</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Command Center Login</h1>
          <p className="text-slate-400 text-xs mt-2">Access Coastal Disaster Management Portal</p>
        </div>

       
        <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          SECURE ENCRYPTED GATEWAY
        </div>

       
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Official Email / ID
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                📧
              </span>
              <input 
                type="email5" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="officer@coastalguard.org" 
                className="w-full bg-[#131F33] border border-[#233554] rounded-xl px-4 py-3 pl-11 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Security Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} className="text-xs text-cyan-400 hover:underline">
                Forgot Code?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                🔒
              </span>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••" 
                className="w-full bg-[#131F33] border border-[#233554] rounded-xl px-4 py-3 pl-11 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-200"
              />
            </div>
          </div>

          
          <button 
            type="submit"
            className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm mt-2"
          >
            <span>🛡️</span>
            Authenticate Access
          </button>
        </form>

       
        <div className="mt-6 text-center border-t border-[#1E293B] pt-6">
          <p className="text-slate-400 text-xs">
            Need field operative clearance?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-cyan-400 font-semibold hover:underline">
              Request Station Access
            </a>
          </p>
        </div>

        
        <div className="mt-6 bg-[#131F33]/60 border border-[#233554] rounded-xl p-3 flex items-center gap-2.5">
          <span className="text-red-500 text-base animate-pulse">🚨</span>
          <span className="text-slate-400 text-[11px]">
            Unauthorized login attempts are logged and reported to the command network.
          </span>
        </div>

      </div>

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
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;