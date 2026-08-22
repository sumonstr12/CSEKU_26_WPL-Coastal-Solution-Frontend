import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4">
      <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-xl shadow-2xl shadow-cyan-900/20 w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-cyan-500 font-bold tracking-wider text-sm uppercase mb-1">
            Coastal & Disaster Management
          </h1>
          <h2 className="text-2xl font-extrabold text-slate-100">
            System Registration
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
              placeholder="+8801XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all appearance-none"
            >
              <option value="" disabled className="text-slate-500">Select an operational role...</option>
              <option value="Citizen" className="bg-slate-800">Citizen</option>
              <option value="Volunteer" className="bg-slate-800">Volunteer</option>
              <option value="Responder" className="bg-slate-800">Responder</option>
              <option value="Local Authority" className="bg-slate-800">Local Authority</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-500 focus:ring-4 focus:ring-cyan-500/30 transition-all shadow-lg shadow-cyan-900/30 mt-4"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;