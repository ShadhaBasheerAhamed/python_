import React from 'react';
import { Compass, Award, CheckCircle2, Target, BarChart2, Flame, Star } from 'lucide-react';
import { BADGES_LIST, LEVELS_CONFIG } from '../data/curriculum';
import { playSound } from '../utils/soundEffects';

export default function StudentProgress({ student, progress, badges, attempts }) {
  if (!student) return null;

  // Calculate topic performance bars from attempts
  const topicStats = {};
  if (attempts && Array.isArray(attempts)) {
    attempts.forEach(a => {
      if (!topicStats[a.topic]) {
        topicStats[a.topic] = { total: 0, correct: 0 };
      }
      topicStats[a.topic].total += 1;
      if (a.is_correct) topicStats[a.topic].correct += 1;
    });
  }

  // Core curriculum topics default display
  const defaultTopics = [
    { name: "Python Introduction", defaultAcc: 95 },
    { name: "Variables", defaultAcc: 90 },
    { name: "Operators", defaultAcc: 85 },
    { name: "Conditions", defaultAcc: 70 },
    { name: "Loops", defaultAcc: 54 },
    { name: "Lists", defaultAcc: 30 },
    { name: "Functions", defaultAcc: 0 }
  ];

  const totalCompletedLevels = progress ? progress.filter(p => p.status === 'completed').length : 0;
  const totalActivitiesCompleted = attempts ? attempts.filter(a => a.is_correct).length : Math.max(12, totalCompletedLevels * 4);
  const totalAttemptsCount = attempts ? attempts.length : totalActivitiesCompleted + 4;
  const accuracyPercent = totalAttemptsCount > 0 ? Math.round((totalActivitiesCompleted / totalAttemptsCount) * 100) : 100;

  const userBadgeKeys = new Set(badges ? badges.map(b => b.badge_key) : ['python_starter']);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-3xl">
            🧭
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">MY PYTHON JOURNEY</h2>
            <p className="text-xs text-slate-400">Detailed skill breakdown & badge achievements</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700">
          <div>
            <div className="text-slate-400 uppercase text-[10px]">Accuracy</div>
            <div className="text-xl font-black text-emerald-400">{accuracyPercent}%</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <div className="text-slate-400 uppercase text-[10px]">Completed</div>
            <div className="text-xl font-black text-white">{totalCompletedLevels} / {LEVELS_CONFIG.length}</div>
          </div>
        </div>
      </div>

      {/* Topic Mastery Progress Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-white font-extrabold text-base">
          <BarChart2 className="w-5 h-5 text-emerald-400" />
          <span>Topic Mastery Levels</span>
        </div>

        <div className="space-y-4 pt-2">
          {defaultTopics.map((top, i) => {
            const stat = topicStats[top.name];
            const acc = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : top.defaultAcc;

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-200">{top.name}</span>
                  <span className={acc >= 75 ? 'text-emerald-400' : acc >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                    {acc}% Mastery
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      acc >= 75
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : acc >= 50
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-500 to-red-400'
                    }`}
                    style={{ width: `${acc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earned Badges Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-extrabold text-base">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>Badge Achievements Showcase ({userBadgeKeys.size}/{BADGES_LIST.length})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {BADGES_LIST.map((b) => {
            const isUnlocked = userBadgeKeys.has(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/90 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'
                }`}
              >
                <div className="text-4xl">{b.icon}</div>
                <h4 className="font-extrabold text-xs text-white leading-tight">{b.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{b.description}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
