import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentLogin from './components/StudentLogin';
import HomeDashboard from './components/HomeDashboard';
import GameMap from './components/GameMap';
import LevelWorkspace from './components/LevelWorkspace';
import RewardModal from './components/RewardModal';
import Leaderboard from './components/Leaderboard';
import StudentProgress from './components/StudentProgress';
import TeacherDashboard from './components/TeacherDashboard';
import DiagnosticTest from './components/DiagnosticTest';
import { playSound } from './utils/soundEffects';

export default function App() {
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);
  const [badges, setBadges] = useState([]);
  const [attempts, setAttempts] = useState([]);

  // Active view
  const [activeTab, setActiveTab] = useState('map'); // 'dashboard' | 'map' | 'journey' | 'leaderboard' | 'level' | 'diagnostic'
  const [activeLevelId, setActiveLevelId] = useState(1);

  // Modals & audio
  const [rewardData, setRewardData] = useState(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [welcomeBackMsg, setWelcomeBackMsg] = useState(null);

  // Focus loss tracking
  const [focusLossCount, setFocusLossCount] = useState(0);

  // Load persistent student profile from localStorage on boot if present
  useEffect(() => {
    const saved = localStorage.getItem('python_quest_active_student');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudent(parsed.student);
        setProgress(parsed.progress || []);
        setBadges(parsed.badges || []);
        setAttempts(parsed.attempts || []);
      } catch (e) {
        console.warn('Failed to parse cached student session:', e);
      }
    }
  }, []);

  // Sync session cache whenever state updates
  useEffect(() => {
    if (student) {
      localStorage.setItem('python_quest_active_student', JSON.stringify({
        student,
        progress,
        badges,
        attempts
      }));
    }
  }, [student, progress, badges, attempts]);

  // Handle Student Login
  const handleStudentLogin = async ({ grade, section, name }) => {
    try {
      const res = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, section, name })
      });

      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        setProgress(data.progress || []);
        setBadges(data.badges || []);
        setActiveTab('dashboard');

        if (data.isReturning) {
          setWelcomeBackMsg(`Welcome back, ${data.student.name}! 🌟 Continue your Python Quest from Level ${data.student.current_level || 1}.`);
        }
      } else {
        throw new Error('Failed to connect to backend server');
      }
    } catch (err) {
      // Offline fallback profile creation/retrieval
      const profileKey = `${grade}-${section}-${name.trim().toLowerCase()}`;
      const localProfile = {
        id: Date.now(),
        name: name.trim(),
        grade,
        section,
        profile_key: profileKey,
        current_level: 1,
        xp: 0,
        stars: 0,
        streak: 1,
        focus_interruptions: 0
      };
      setStudent(localProfile);
      setProgress([{ level_id: 1, topic: 'Python Introduction', status: 'unlocked', stars: 0 }]);
      setBadges([{ badge_key: 'python_starter', badge_name: '🐍 Python Starter' }]);
      setActiveTab('dashboard');
    }
  };

  // Complete Level Handler
  const handleLevelComplete = async ({ level_id, stars, xp_earned, score, topic }) => {
    try {
      const res = await fetch('/api/progress/complete-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          level_id,
          stars,
          xp_earned,
          score,
          topic
        })
      });

      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        setProgress(data.progress || []);
        setBadges(data.badges || []);

        setRewardData({
          levelId: level_id,
          stars,
          xpEarned: xp_earned,
          newBadges: data.newBadgesEarned
        });
      }
    } catch (err) {
      // Offline fallback — update progress array properly so next level unlocks
      const updatedXP = (student.xp || 0) + xp_earned;
      const updatedStars = (student.stars || 0) + stars;
      const nextLevel = Math.max(student.current_level || 1, level_id + 1);

      const updatedStudent = { ...student, xp: updatedXP, stars: updatedStars, current_level: nextLevel };
      setStudent(updatedStudent);

      // Update progress: mark current level complete + unlock next level
      setProgress(prev => {
        const updated = prev.filter(p => p.level_id !== level_id && p.level_id !== nextLevel);
        updated.push({ level_id, topic, status: 'completed', stars });
        if (nextLevel <= 22) {
          updated.push({ level_id: nextLevel, topic: `Level ${nextLevel}`, status: 'unlocked', stars: 0 });
        }
        return updated;
      });

      setRewardData({
        levelId: level_id,
        stars,
        xpEarned: xp_earned,
        newBadges: []
      });
    }
  };

  // Record Attempt Handler
  const handleRecordAttempt = async (attemptData) => {
    setAttempts(prev => [...prev, { ...attemptData, created_at: new Date().toISOString() }]);
    try {
      await fetch('/api/attempts/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          ...attemptData
        })
      });
    } catch (e) {
      // Ignore network errors on attempt log
    }
  };

  // Handle Focus Loss Event
  const handleFocusLost = async () => {
    setFocusLossCount(prev => prev + 1);
    if (student) {
      setStudent(prev => ({ ...prev, focus_interruptions: (prev.focus_interruptions || 0) + 1 }));
      try {
        await fetch('/api/students/focus-lost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: student.id })
        });
      } catch (e) {}
    }
  };

  // Diagnostic Placement Test completion
  const handleDiagnosticComplete = (recommendedLevel) => {
    if (student) {
      setStudent(prev => ({ ...prev, current_level: recommendedLevel }));
    }
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-game selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        student={student}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTeacherLogin={() => setIsTeacherModalOpen(true)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        focusLossCount={focusLossCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-4 sm:pt-6 pb-16">
        
        {/* Welcome Back Toast Notice */}
        {welcomeBackMsg && (
          <div className="max-w-xl mx-auto mt-4 px-4">
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-fade-in">
              <span>{welcomeBackMsg}</span>
              <button onClick={() => setWelcomeBackMsg(null)} className="text-slate-400 hover:text-white font-extrabold">×</button>
            </div>
          </div>
        )}

        {/* 1. Student Login (If not logged in) */}
        {!student && activeTab !== 'diagnostic' && (
          <StudentLogin
            onLogin={handleStudentLogin}
            onStartDiagnostic={() => setActiveTab('diagnostic')}
          />
        )}

        {/* 2. Diagnostic Placement Test */}
        {activeTab === 'diagnostic' && (
          <DiagnosticTest
            onCompleteDiagnostic={handleDiagnosticComplete}
            onCancel={() => setActiveTab('map')}
          />
        )}

        {/* 3. Student Home Dashboard */}
        {student && activeTab === 'dashboard' && (
          <HomeDashboard
            student={student}
            progress={progress}
            badges={badges}
            onNavigateMap={() => setActiveTab('map')}
            onStartLevel={(lvlId) => {
              setActiveLevelId(lvlId);
              setActiveTab('level');
            }}
          />
        )}

        {/* 4. Visual Quest Map */}
        {student && activeTab === 'map' && (
          <GameMap
            student={student}
            progress={progress}
            onSelectLevel={(lvlId) => {
              setActiveLevelId(lvlId);
              setActiveTab('level');
            }}
          />
        )}

        {/* 5. Level Interactive Gameplay Workspace */}
        {student && activeTab === 'level' && (
          <LevelWorkspace
            levelId={activeLevelId}
            student={student}
            onBackToMap={() => setActiveTab('map')}
            onLevelComplete={handleLevelComplete}
            onRecordAttempt={handleRecordAttempt}
            onFocusLost={handleFocusLost}
          />
        )}

        {/* 6. Leaderboard Page */}
        {student && activeTab === 'leaderboard' && (
          <Leaderboard student={student} />
        )}

        {/* 7. Student Journey / Progress Page */}
        {student && activeTab === 'journey' && (
          <StudentProgress
            student={student}
            progress={progress}
            badges={badges}
            attempts={attempts}
          />
        )}

      </main>

      {/* Level Completion Reward Modal */}
      {rewardData && (
        <RewardModal
          levelId={rewardData.levelId}
          stars={rewardData.stars}
          xpEarned={rewardData.xpEarned}
          newBadges={rewardData.newBadges}
          onContinue={() => {
            setRewardData(null);
            setActiveTab('map');
          }}
        />
      )}

      {/* Protected Teacher Dashboard Portal Modal */}
      {isTeacherModalOpen && (
        <TeacherDashboard onClose={() => setIsTeacherModalOpen(false)} />
      )}

    </div>
  );
}
