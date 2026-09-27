import React from 'react';
import { Volume2, VolumeX, Shield, Trophy, Map, LayoutDashboard, Compass, Lock, Flame } from 'lucide-react';
import { isSoundEnabled, toggleSound, playSound } from '../utils/soundEffects';

export default function Navbar({
  student,
  activeTab,
  setActiveTab,
  onOpenTeacherLogin,
  isMuted,
  setIsMuted,
  focusLossCount
}) {
  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    toggleSound(!newMuted);
    if (!newMuted) playSound('click');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { playSound('click'); setActiveTab('map'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            🐍
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              PYTHON QUEST
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Learn Python. Solve Challenges. Level Up!
            </p>
          </div>
        </div>

        {/* Navigation Tabs (When logged in) */}
        {student && (
          <nav className="flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => { playSound('click'); setActiveTab('dashboard'); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { playSound('click'); setActiveTab('map'); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Quest Map</span>
            </button>

            <button
              onClick={() => { playSound('click'); setActiveTab('journey'); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'journey'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>My Journey</span>
            </button>

            <button
              onClick={() => { playSound('click'); setActiveTab('leaderboard'); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </nav>
        )}

        {/* Right Stats & Teacher Portal */}
        <div className="flex items-center gap-3">
          {student && (
            <div className="hidden lg:flex items-center gap-3 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span>⚡</span>
                <span>{student.xp || 0} XP</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex items-center gap-1 text-orange-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>{student.streak || 1}d</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex items-center gap-1 text-teal-300 font-bold">
                <span>👤</span>
                <span>{student.name} ({student.grade}-{student.section})</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Teacher Login Button */}
          <button
            onClick={() => { playSound('click'); onOpenTeacherLogin(); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600/90 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 hover:border-indigo-500 transition shadow-sm"
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Teacher Portal</span>
          </button>
        </div>

      </div>
    </header>
  );
}
