import React from 'react';
import { Lock, Star, Play, CheckCircle2, Sparkles, Trophy, BookOpen } from 'lucide-react';
import { LEVELS_CONFIG } from '../data/curriculum';
import { playSound } from '../utils/soundEffects';

// Theme zone color palettes
const THEME_COLORS = {
  'Coding Forest':     { bg: 'from-emerald-950/80 to-teal-950/80', border: 'border-emerald-700/40', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'from-emerald-500 to-teal-400' },
  'Variables Village': { bg: 'from-violet-950/80 to-slate-950/80', border: 'border-violet-700/40', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30', dot: 'from-violet-500 to-indigo-400' },
  'Input Island':      { bg: 'from-sky-950/80 to-slate-950/80', border: 'border-sky-700/40', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30', dot: 'from-sky-500 to-blue-400' },
  'Operators Zone':    { bg: 'from-orange-950/80 to-slate-950/80', border: 'border-orange-700/40', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30', dot: 'from-orange-500 to-amber-400' },
  'Logic Mountain':    { bg: 'from-rose-950/80 to-slate-950/80', border: 'border-rose-700/40', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', dot: 'from-rose-500 to-pink-400' },
  'Loop Forest':       { bg: 'from-cyan-950/80 to-slate-950/80', border: 'border-cyan-700/40', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', dot: 'from-cyan-500 to-teal-400' },
  'Strings Street':    { bg: 'from-yellow-950/80 to-slate-950/80', border: 'border-yellow-700/40', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', dot: 'from-yellow-500 to-amber-400' },
  'Lists Land':        { bg: 'from-lime-950/80 to-slate-950/80', border: 'border-lime-700/40', badge: 'bg-lime-500/20 text-lime-300 border-lime-500/30', dot: 'from-lime-500 to-green-400' },
  'Data Dungeon':      { bg: 'from-indigo-950/80 to-slate-950/80', border: 'border-indigo-700/40', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', dot: 'from-indigo-500 to-purple-400' },
  'Function Castle':   { bg: 'from-purple-950/80 to-slate-950/80', border: 'border-purple-700/40', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', dot: 'from-purple-500 to-violet-400' },
  'Debugging Lab':     { bg: 'from-red-950/80 to-slate-950/80', border: 'border-red-700/40', badge: 'bg-red-500/20 text-red-300 border-red-500/30', dot: 'from-red-500 to-rose-400' },
  'Python Space Station': { bg: 'from-slate-900/80 to-indigo-950/80', border: 'border-indigo-500/40', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', dot: 'from-indigo-500 to-violet-400' },
};

const getTheme = (theme) => THEME_COLORS[theme] || THEME_COLORS['Coding Forest'];

export default function GameMap({ student, progress, onSelectLevel }) {
  const studentGrade = student?.grade || 'Grade 8';

  // Build quick status map from student progress
  const progressMap = {};
  if (progress && Array.isArray(progress)) {
    progress.forEach(p => {
      progressMap[p.level_id] = p;
    });
  }

  // Current active level (student's saved level or 1)
  const currentLevelId = student?.current_level || 1;

  // ✅ UNLOCK LOGIC: Sequential only — no grade restriction.
  // Any student (Grade 6 to Grade 12) can access ALL 22 levels.
  // You unlock the next level by completing the previous one.
  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true; // Level 1 always open
    const prev = progressMap[levelId - 1];
    if (prev && prev.status === 'completed') return true;
    const curr = progressMap[levelId];
    if (curr && (curr.status === 'unlocked' || curr.status === 'completed')) return true;
    return levelId <= currentLevelId;
  };

  const totalLevels = LEVELS_CONFIG.length;
  const completedCount = LEVELS_CONFIG.filter(l => progressMap[l.id]?.status === 'completed').length;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">

      {/* Map Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VISUAL PYTHON QUEST MAP</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
          🏕️ Python Journey Trail
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Every student starts from the very beginning — <strong className="text-emerald-400">print()</strong> to <strong className="text-purple-400">Advanced Python</strong>. Learn at your own pace, no shortcuts!
        </p>
      </div>

      {/* Student Journey Progress Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{studentGrade} Journey</p>
            <p className="text-sm font-black text-white truncate">{completedCount} of {totalLevels} Levels Completed</p>
          </div>
        </div>
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Progress</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-300">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Complete prev level to unlock next</span>
        </div>
      </div>

      {/* 🔔 Important Notice */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl px-5 py-3.5 flex items-start gap-3 text-sm text-indigo-300">
        <span className="text-lg shrink-0">💡</span>
        <span>
          <strong>Everyone starts at Level 1 — no matter your grade!</strong> Whether you're in Grade 6 or Grade 12 and learning Python for the first time, you begin with <code className="bg-indigo-500/20 px-1.5 py-0.5 rounded font-code">print()</code> and work all the way up to advanced topics. Each level unlocks only after you complete the one before it.
        </span>
      </div>

      {/* Visual Quest Map Trail */}
      <div className="relative py-6">
        {/* Central Connecting Snake Trail Cable */}
        <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-indigo-600 rounded-full -translate-x-1/2 opacity-30" />

        <div className="space-y-10 relative z-10">
          {LEVELS_CONFIG.map((lvl, idx) => {
            const unlocked = isLevelUnlocked(lvl.id);
            const levelProgress = progressMap[lvl.id];
            const isCompleted = levelProgress?.status === 'completed';
            const stars = levelProgress?.stars || 0;
            const isCurrent = lvl.id === currentLevelId && unlocked && !isCompleted;
            const theme = getTheme(lvl.theme);

            const isEven = idx % 2 === 0;

            return (
              <div
                key={lvl.id}
                className={`flex items-center gap-4 sm:gap-8 ${
                  isEven ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Level Card Box */}
                <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                  <div
                    onClick={() => {
                      if (unlocked) {
                        playSound('click');
                        onSelectLevel(lvl.id);
                      }
                    }}
                    className={`inline-block w-full max-w-sm p-4 sm:p-5 rounded-3xl border transition-all text-left ${
                      unlocked
                        ? isCurrent
                          ? `bg-gradient-to-br ${theme.bg} ${theme.border} shadow-xl ring-2 ring-emerald-500/40 cursor-pointer hover:scale-[1.02]`
                          : isCompleted
                          ? `bg-gradient-to-br ${theme.bg} ${theme.border} hover:opacity-90 cursor-pointer hover:scale-[1.02]`
                          : 'bg-slate-900/80 border-slate-700 hover:border-emerald-500/60 cursor-pointer hover:scale-[1.02]'
                        : 'bg-slate-950/60 border-slate-800/60 opacity-50 cursor-not-allowed select-none'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl shrink-0">{lvl.icon}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider truncate">
                            Level {lvl.id} • {lvl.theme}
                          </span>
                          <h3 className="text-base font-extrabold text-white leading-tight">
                            {lvl.title}
                          </h3>
                        </div>
                      </div>

                      {/* Stars / Lock / Unlocked Badge */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <div className="flex items-center gap-0.5 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-full">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= stars
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        ) : unlocked ? (
                          <span className={`px-2 py-0.5 border ${theme.badge} text-[10px] font-bold rounded-full`}>
                            {isCurrent ? '▶ ACTIVE' : 'UNLOCKED'}
                          </span>
                        ) : (
                          <Lock className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                      {lvl.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold">+{lvl.xpReward} XP</span>

                      {unlocked ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                          <span>{isCompleted ? 'Replay Level' : 'Start Challenge'}</span>
                          <Play className="w-3 h-3 fill-emerald-400" />
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Complete Level {lvl.id - 1} first
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Central Node Orb */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <div
                    onClick={() => {
                      if (unlocked) {
                        playSound('click');
                        onSelectLevel(lvl.id);
                      }
                    }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-lg transition-all shadow-xl z-20 cursor-pointer ${
                      isCompleted
                        ? `bg-gradient-to-tr ${theme.dot} text-slate-950 ring-4 ring-emerald-500/20`
                        : isCurrent
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 ring-4 ring-yellow-400/50 scale-110 animate-bounce-slow'
                        : unlocked
                        ? 'bg-slate-800 text-emerald-400 border-2 border-emerald-500/50 hover:scale-105'
                        : 'bg-slate-900 text-slate-600 border-2 border-slate-800'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-7 h-7 text-slate-950" />
                    ) : unlocked ? (
                      <span>{lvl.id}</span>
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Empty spacer for visual balance */}
                <div className="flex-1 hidden sm:block" />
              </div>
            );
          })}
        </div>

        {/* End of map */}
        <div className="text-center mt-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-sm font-black text-indigo-300">
            <span>🚀</span>
            <span>Complete all 22 levels to become a Python Champion!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
