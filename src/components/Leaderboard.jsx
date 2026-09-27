import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Filter, Eye, EyeOff, Search } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export default function Leaderboard({ student }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(student?.grade || 'All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [maskPrivacy, setMaskPrivacy] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let url = '/api/leaderboard';
      const queryParams = [];
      if (selectedGrade !== 'All') queryParams.push(`grade=${encodeURIComponent(selectedGrade)}`);
      if (selectedSection !== 'All') queryParams.push(`section=${encodeURIComponent(selectedSection)}`);
      if (queryParams.length > 0) url += '?' + queryParams.join('&');

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLeaderboardData(data);
      } else {
        // Fallback local mock leaderboard data if server not reachable
        setLeaderboardData([
          { id: student?.id || 1, name: student?.name || 'Arun', grade: student?.grade || 'Grade 8', section: student?.section || 'A', current_level: student?.current_level || 4, xp: student?.xp || 680, stars: student?.stars || 42, streak: student?.streak || 4 },
          { id: 2, name: 'Rohan Verma', grade: 'Grade 8', section: 'A', current_level: 6, xp: 1180, stars: 38, streak: 5 },
          { id: 3, name: 'Sanya Gupta', grade: 'Grade 8', section: 'B', current_level: 5, xp: 1090, stars: 35, streak: 3 },
          { id: 4, name: 'Ananya Roy', grade: 'Grade 7', section: 'A', current_level: 4, xp: 820, stars: 28, streak: 2 },
          { id: 5, name: 'Kabir Das', grade: 'Grade 9', section: 'C', current_level: 7, xp: 750, stars: 24, streak: 1 }
        ]);
      }
    } catch (e) {
      console.warn('Leaderboard fetch fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGrade, selectedSection]);

  const maskName = (name) => {
    if (!maskPrivacy) return name;
    if (name.length <= 2) return name[0] + '*';
    return name[0] + '****' + name[name.length - 1];
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-3xl">
            🏆
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Python Leaderboard</h2>
            <p className="text-xs text-slate-400">See top coders across grades & sections!</p>
          </div>
        </div>

        {/* Privacy Mask Toggle */}
        <button
          onClick={() => setMaskPrivacy(!maskPrivacy)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition"
        >
          {maskPrivacy ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
          <span>{maskPrivacy ? 'Names Masked' : 'Privacy Mode'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => { playSound('click'); setSelectedGrade('All'); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              selectedGrade === 'All' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌎 All Grades
          </button>

          <button
            onClick={() => { playSound('click'); setSelectedGrade(student?.grade || 'Grade 8'); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              selectedGrade === student?.grade ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🏫 My Grade ({student?.grade || 'Grade 8'})
          </button>

        </div>

        {/* Section Select */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">Section:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 font-bold text-white focus:outline-none"
          >
            <option value="All">All Sections</option>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(s => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading Leaderboard Data...</div>
        ) : leaderboardData.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No students found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4 text-center">Rank</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Grade & Sec</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Stars</th>
                  <th className="py-3.5 px-4 text-right">XP Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {leaderboardData.map((s, idx) => {
                  const rank = idx + 1;
                  const isMe = student && s.id === student.id;

                  return (
                    <tr
                      key={s.id}
                      className={`transition ${
                        isMe
                          ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500 font-bold'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-extrabold">
                        {rank === 1 ? (
                          <span className="text-xl">🥇</span>
                        ) : rank === 2 ? (
                          <span className="text-xl">🥈</span>
                        ) : rank === 3 ? (
                          <span className="text-xl">🥉</span>
                        ) : (
                          <span className="text-slate-400">#{rank}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span>{maskName(s.name)}</span>
                        {isMe && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-extrabold">YOU</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 text-xs">
                        {s.grade} - {s.section}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-teal-300">
                        Level {s.current_level}
                      </td>
                      <td className="py-3.5 px-4 text-yellow-400 font-bold">
                        ⭐ {s.stars || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-amber-400">
                        ⚡ {s.xp || 0} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
