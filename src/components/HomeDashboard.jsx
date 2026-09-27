import React from 'react';
import { Play, Flame, Star, Trophy, Target, ArrowRight, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/soundEffects';
import { LEVELS_CONFIG } from '../data/curriculum';

export default function HomeDashboard({ student, progress, badges, onNavigateMap, onStartLevel }) {
  if (!student) return null;

  const currentLevelId = student.current_level || 1;
  const currentLevelConfig = LEVELS_CONFIG.find(l => l.id === currentLevelId) || LEVELS_CONFIG[0];
  const nextLevelConfig = LEVELS_CONFIG.find(l => l.id === currentLevelId + 1) || currentLevelConfig;

  // Calculate overall progress %
  const totalLevels = LEVELS_CONFIG.length;
  const completedCount = progress.filter(p => p.status === 'completed').length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLevels) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl">
                👤
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                  {student.grade} • Section {student.section}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  {student.streak || 1} Day Streak
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Welcome back, {student.name}! 🌟
              </h2>
              <p className="text-sm text-slate-300 font-medium">
                Continue your Python Quest from <strong className="text-emerald-400">Level {currentLevelId}: {currentLevelConfig.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => { playSound('click'); onStartLevel(currentLevelId); }}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 text-base transition transform active:scale-95 shrink-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>CONTINUE QUEST</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Level Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-2xl">
            🏆
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Level</div>
            <div className="text-2xl font-black text-white">{currentLevelId}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentLevelConfig.title}</div>
          </div>
        </div>

        {/* XP Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-2xl">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total XP</div>
            <div className="text-2xl font-black text-amber-400">{student.xp || 0}</div>
            <div className="text-[11px] text-slate-400">XP Points</div>
          </div>
        </div>

        {/* Stars Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-2xl">
            ⭐
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stars</div>
            <div className="text-2xl font-black text-yellow-300">{student.stars || 0}</div>
            <div className="text-[11px] text-slate-400">Earned</div>
          </div>
        </div>

        {/* Badges Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-2xl">
            🎖️
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badges</div>
            <div className="text-2xl font-black text-indigo-300">{badges ? badges.length : 1}</div>
            <div className="text-[11px] text-slate-400">Unlocked</div>
          </div>
        </div>

      </div>

      {/* Main Quest Progress Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Overall Quest Completion</span>
          </div>
          <span className="font-extrabold text-emerald-400">{progressPercent}%</span>
        </div>

        {/* Bar */}
        <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-md shadow-emerald-500/50"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-1">
          <span>{completedCount} of {totalLevels} Levels Mastered</span>
          <span>Next Rank: <strong className="text-white">{nextLevelConfig.title}</strong></span>
        </div>
      </div>

      {/* Grid Features: Daily Challenge & Adaptive Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Challenge Card */}
        <div className="bg-gradient-to-br from-slate-900 to-orange-950/20 border border-orange-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                DAILY PYTHON CHALLENGE
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                +50 XP
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white">
              "Predict Python Output!"
            </h3>
            <p className="text-xs text-slate-300">
              Complete today's fast challenge to keep your streak alive and earn bonus XP!
            </p>
          </div>

          <button
            onClick={() => { playSound('click'); onStartLevel(currentLevelId); }}
            className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            <span>Play Daily Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Adaptive Learning Recommendation Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs">
                <Target className="w-3.5 h-3.5" />
                ADAPTIVE RECOMMENDATION
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white">
              Targeted Concept Practice
            </h3>
            <p className="text-xs text-slate-300">
              Our AI learning engine suggests strengthening your <strong className="text-indigo-300">Loop Logic & Condition</strong> skills to boost accuracy!
            </p>
          </div>

          <button
            onClick={() => { playSound('click'); onNavigateMap(); }}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Quest Learning Map</span>
          </button>
        </div>

      </div>

    </div>
  );
}
