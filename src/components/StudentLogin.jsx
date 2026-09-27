import React, { useState } from 'react';
import { Play, Sparkles, UserCheck, ChevronDown, GraduationCap, Layers } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

const GRADE_OPTIONS = [
  { value: 'Grade 6', label: 'Grade 6', desc: 'Start from Basics → Advanced', icon: '🌱' },
  { value: 'Grade 7', label: 'Grade 7', desc: 'Start from Basics → Advanced', icon: '📚' },
  { value: 'Grade 8', label: 'Grade 8', desc: 'Start from Basics → Advanced', icon: '⚡' },
  { value: 'Grade 9', label: 'Grade 9', desc: 'Start from Basics → Advanced', icon: '🧩' },
  { value: 'Grade 10', label: 'Grade 10', desc: 'Start from Basics → Advanced', icon: '🧠' },
  { value: 'Grade 11', label: 'Grade 11', desc: 'Start from Basics → Advanced', icon: '💻' },
  { value: 'Grade 12', label: 'Grade 12', desc: 'Start from Basics → Advanced', icon: '🚀' }
];

export default function StudentLogin({ onLogin, onStartDiagnostic }) {
  const [grade, setGrade] = useState('Grade 8');
  const [section, setSection] = useState('A');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your student name!');
      return;
    }

    setError('');
    setLoading(true);
    playSound('click');

    try {
      await onLogin({ grade, section, name: name.trim() });
    } catch (err) {
      setError(err.message || 'Login failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const selectedGradeObj = GRADE_OPTIONS.find(g => g.value === grade) || GRADE_OPTIONS[2];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative overflow-hidden font-game">
      
      {/* Dynamic Cute Ambient Glow Orbs */}
      <div className="absolute top-12 left-1/3 w-80 h-80 bg-emerald-500/20 rounded-full filter blur-3xl pointer-events-none animate-float-glow" />
      <div className="absolute bottom-12 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl pointer-events-none animate-float-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Glass Card Container */}
      <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 animate-fade-in">
        
        {/* Banner Mascot Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-indigo-500/20 border-2 border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-5xl animate-bounce-slow">🐍</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              PRO
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Begin Your Python Quest!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grades 6–12 • Interactive Python Adventure
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-300 text-xs text-center font-bold animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Custom Cute Grade Selector */}
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Select Your Grade</span>
            </label>

            <div className="relative">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-950/80 border-2 border-slate-800 hover:border-emerald-500/50 rounded-2xl px-4 py-3.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition cursor-pointer"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value} className="bg-slate-900 text-slate-100 py-2">
                    {g.icon} {g.label} — {g.desc}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>

            {/* Selected Grade Badge Preview Pill */}
            <div className="mt-2 flex items-center gap-2 p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs">
              <span className="text-lg">{selectedGradeObj.icon}</span>
              <span className="text-emerald-400 font-extrabold">{selectedGradeObj.label}:</span>
              <span className="text-slate-300 font-medium">{selectedGradeObj.desc}</span>
            </div>
          </div>

          {/* Section Selection Buttons */}
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Select Section</span>
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => { playSound('click'); setSection(sec); }}
                  className={`py-2.5 rounded-xl font-black text-xs transition-all duration-150 ${
                    section === sec
                      ? 'bg-emerald-400 text-slate-950 shadow-[0_4px_0_#059669] scale-105'
                      : 'bg-slate-800/90 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Student Full Name Input */}
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Student Name
            </label>
            <input
              type="text"
              placeholder="e.g. Arun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950/80 border-2 border-slate-800 hover:border-emerald-500/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 font-bold focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
            />
          </div>

          {/* Returning Student Auto-Save Notice */}
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 leading-snug">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Returning Student?</strong> Re-enter your same Grade, Section, and Name to pick up right where you stopped!
            </span>
          </div>

          {/* Start Quest 3D Tactile Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-game-emerald py-4 px-6 text-base flex items-center justify-center gap-2 tracking-wide disabled:opacity-50"
          >
            {loading ? (
              <span>Connecting Profile...</span>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>START PYTHON QUEST</span>
              </>
            )}
          </button>
        </form>

        {/* Diagnostic Starter Test Link */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <button
            onClick={() => { playSound('click'); onStartDiagnostic(); }}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-400 hover:text-indigo-300 transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Take Diagnostic Starter Test (Optional)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
