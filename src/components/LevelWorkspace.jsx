import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Lightbulb, CheckCircle, XCircle, Play, Shield, Flame,
  Clock, RotateCcw, Award, ChevronRight, HelpCircle, Eye, EyeOff, MoveUp, MoveDown
} from 'lucide-react';
import { getLevelContent } from '../data/questionsBank';
import { LEVELS_CONFIG } from '../data/curriculum';
import { playSound } from '../utils/soundEffects';
import { runPythonCode } from '../utils/pyodideRunner';

export default function LevelWorkspace({
  levelId,
  student,
  onBackToMap,
  onLevelComplete,
  onRecordAttempt,
  onFocusLost
}) {
  const levelConfig = LEVELS_CONFIG.find(l => l.id === levelId) || LEVELS_CONFIG[0];
  const levelData = getLevelContent(levelId);

  const [step, setStep] = useState('learn'); // 'learn' | 'activities'
  const [activityIndex, setActivityIndex] = useState(0);
  
  // Game states
  const [userAnswer, setUserAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintStage, setHintStage] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [score, setScore] = useState(0);

  // Drag and drop block state
  const [draggedBlocks, setDraggedBlocks] = useState([]);

  // Code ordering state
  const [orderedLines, setOrderedLines] = useState([]);
  
  // Matching state
  const [selectedMatch, setSelectedMatch] = useState({});
  const [shuffledMatchOptions, setShuffledMatchOptions] = useState([]);

  // Code editor states
  const [userCode, setUserCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Boss Battle state
  const [bossHp, setBossHp] = useState(100);

  // Timer / Speed Challenge state
  const [timerSeconds, setTimerSeconds] = useState(30);

  // Focus mode
  const [focusMode, setFocusMode] = useState(false);

  // Learn-from-mistake state
  const [retryMode, setRetryMode] = useState(false);   // after wrong answer, student can retry
  const [mistakeCount, setMistakeCount] = useState(0); // how many wrong attempts this activity
  const [learnedFromMistake, setLearnedFromMistake] = useState(false); // got it right on retry

  const currentActivity = levelData.activities ? levelData.activities[activityIndex] : null;

  // Setup activity when index or level changes
  useEffect(() => {
    setIsAnswered(false);
    setIsCorrect(false);
    setUserAnswer(null);
    setShowHint(false);
    setHintStage(0);
    setDraggedBlocks([]);
    setSelectedMatch({});
    setShuffledMatchOptions([]);
    setCodeOutput('');
    setCodeError('');
    setRetryMode(false);
    setMistakeCount(0);
    setLearnedFromMistake(false);

    if (currentActivity) {
      if (currentActivity.type === 'actual_code') {
        setUserCode(currentActivity.initialCode || '');
      }
      if (currentActivity.type === 'boss_battle') {
        setBossHp(currentActivity.bossHp || 100);
      }
      if (currentActivity.type === 'speed_challenge') {
        setTimerSeconds(30);
      }
      if (currentActivity.type === 'code_ordering' && currentActivity.lines) {
        // Shuffle initial lines for ordering challenge
        let shuffled = [...currentActivity.lines].sort(() => 0.5 - Math.random());
        // If random shuffle accidentally matches correct order, force a scramble
        if (JSON.stringify(shuffled) === JSON.stringify(currentActivity.correctOrder)) {
          shuffled = [...currentActivity.lines].reverse();
        }
        setOrderedLines(shuffled);
      }
      if (currentActivity.type === 'matching' && currentActivity.pairs) {
        // Shuffle match target options — guarantee different from original order
        let matches = currentActivity.pairs.map(p => p.match);
        let shuffled = [...matches];
        let attempts = 0;
        do {
          shuffled = [...matches].sort(() => 0.5 - Math.random());
          attempts++;
        } while (
          attempts < 20 &&
          JSON.stringify(shuffled) === JSON.stringify(matches)
        );
        // If still same after attempts (e.g. 1-item list), do a manual shift
        if (JSON.stringify(shuffled) === JSON.stringify(matches) && matches.length > 1) {
          shuffled = [...matches.slice(1), matches[0]];
        }
        setShuffledMatchOptions(shuffled);
      }
    }
  }, [activityIndex, levelId, step]);

  // Window Focus Mode detection
  useEffect(() => {
    const handleBlur = () => {
      if (focusMode) {
        onFocusLost();
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [focusMode, onFocusLost]);

  // Speed challenge countdown timer
  useEffect(() => {
    if (step === 'activities' && currentActivity?.type === 'speed_challenge' && !isAnswered && timerSeconds > 0) {
      const timer = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, activityIndex, isAnswered, timerSeconds]);

  // Handle Drag & Drop Block click
  const handleBlockClick = (block) => {
    if (isAnswered) return;
    playSound('click');
    setDraggedBlocks(prev => [...prev, block]);
  };

  const handleRemoveBlock = (index) => {
    if (isAnswered) return;
    playSound('click');
    setDraggedBlocks(prev => prev.filter((_, i) => i !== index));
  };

  // Move Code Line Up/Down in Code Ordering
  const moveLine = (index, direction) => {
    if (isAnswered) return;
    playSound('click');
    const newLines = [...orderedLines];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newLines.length) return;
    const temp = newLines[index];
    newLines[index] = newLines[targetIdx];
    newLines[targetIdx] = temp;
    setOrderedLines(newLines);
  };

  // Run Code via Pyodide
  const handleRunCode = async () => {
    // Prevent running if code still has unfilled ___ placeholders
    if (userCode.includes('___')) {
      setCodeError('⚠️ Replace all ___ placeholders with your actual Python code before running!');
      return;
    }

    setIsExecuting(true);
    setCodeOutput('');
    setCodeError('');
    playSound('click');

    const res = await runPythonCode(userCode);
    setIsExecuting(false);

    setCodeOutput(res.output);
    setCodeError(res.error || '');

    const expected = currentActivity.expectedOutput?.trim();
    const actual = res.output?.trim();

    if (!res.error && actual === expected) {
      handleEvaluateAnswer(true);
    } else if (res.error) {
      setCodeError(res.error);
    }
  };

  // Submit & Evaluate Answer
  const handleEvaluateAnswer = (correctOverride = null) => {
    if (isAnswered || !currentActivity) return;

    let correct = false;

    if (correctOverride !== null) {
      correct = correctOverride;
    } else if (['mcq', 'true_false', 'fill_blank', 'find_bug', 'output_prediction', 'boss_battle'].includes(currentActivity.type)) {
      correct = userAnswer === currentActivity.answer;
    } else if (currentActivity.type === 'drag_drop') {
      correct = JSON.stringify(draggedBlocks) === JSON.stringify(currentActivity.correctOrder);
    } else if (currentActivity.type === 'code_ordering') {
      correct = JSON.stringify(orderedLines) === JSON.stringify(currentActivity.correctOrder);
    } else if (currentActivity.type === 'matching') {
      let allMatch = true;
      if (currentActivity.pairs) {
        currentActivity.pairs.forEach(p => {
          if (selectedMatch[p.item] !== p.match) allMatch = false;
        });
      }
      correct = allMatch;
    } else if (currentActivity.type === 'speed_challenge') {
      correct = userAnswer === currentActivity.answer && timerSeconds > 0;
    }

    setIsAnswered(true);
    setIsCorrect(correct);

    const awardXp = correct ? (currentActivity.xp || 20) : 0;
    if (correct) {
      playSound('correct');
      setXpEarned(prev => prev + awardXp);
      if (!retryMode) {
        // Only count score if got correct on FIRST attempt (no retry)
        setScore(prev => prev + 1);
      } else {
        // Got it right after retrying — learned from mistake!
        setLearnedFromMistake(true);
      }
      if (currentActivity.type === 'boss_battle') {
        playSound('boss_hit');
        setBossHp(prev => Math.max(0, prev - 50));
      }
    } else {
      playSound('wrong');
      setMistakeCount(prev => prev + 1);
    }

    // Log attempt for analytics
    onRecordAttempt({
      activity_id: currentActivity.id,
      level_id: levelId,
      topic: levelConfig.topic,
      is_correct: correct,
      time_taken: 10
    });
  };

  // Advance to Next Activity or Finish Level
  const handleNextActivity = () => {
    playSound('click');
    if (activityIndex + 1 < levelData.activities.length) {
      setActivityIndex(prev => prev + 1);
    } else {
      // Calculate stars
      const totalActivities = levelData.activities.length;
      const ratio = score / totalActivities;
      const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;

      playSound('level_up');
      onLevelComplete({
        level_id: levelId,
        stars,
        xp_earned: xpEarned + levelConfig.xpReward,
        score,
        topic: levelConfig.topic
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-5 animate-fade-in font-game">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl gap-3">
        <button
          onClick={() => { playSound('click'); onBackToMap(); }}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Map</span>
        </button>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-extrabold text-white">
            Level {levelId}: {levelConfig.title}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            ⚡ +{xpEarned} XP
          </span>
        </div>

        {/* Focus Mode Toggle */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            focusMode
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
          title="Focus mode logs tab-switching interrupts"
        >
          {focusMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Focus Mode</span>
        </button>
      </div>

      {/* LEARN STEP */}
      {step === 'learn' && (
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{levelConfig.icon}</span>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Concept Introduction</span>
              <h2 className="text-2xl font-black text-white font-display">{levelData.intro.title}</h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            {levelData.intro.content}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {levelData.learnCards.map((card, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <h4 className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                  {card.heading}
                </h4>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-normal">
                  {card.text}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => { playSound('click'); setStep('activities'); }}
            className="w-full btn-game-emerald py-4 px-6 text-base flex items-center justify-center gap-2"
          >
            <span>START PRACTICE ACTIVITIES ({levelData.activities.length})</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ACTIVITIES STEP */}
      {step === 'activities' && currentActivity && (
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl animate-fade-in">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-800 pb-3">
            <span>Activity {activityIndex + 1} of {levelData.activities.length}</span>
            <span className="uppercase px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-extrabold text-[10px] tracking-wider">
              {currentActivity.type.replace('_', ' ')}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug font-display whitespace-pre-wrap">
              {currentActivity.question}
            </h3>

            {/* Optional Code Snippet / Template Display */}
            {(currentActivity.code || currentActivity.codeTemplate) && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-code text-sm text-emerald-300 overflow-x-auto">
                <pre className="whitespace-pre leading-relaxed">{currentActivity.code || currentActivity.codeTemplate}</pre>
              </div>
            )}
          </div>

          {/* ACTIVITY INTERACTIVE INPUT BOARDS */}

          {/* 1. MCQ / True-False / Fill Blank / Find Bug / Output Prediction */}
          {['mcq', 'true_false', 'fill_blank', 'find_bug', 'output_prediction'].includes(currentActivity.type) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentActivity.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => { playSound('click'); setUserAnswer(opt); }}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                    userAnswer === opt
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30 shadow-lg'
                      : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <span className="whitespace-pre-wrap">{opt}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0 ml-2 ${
                    userAnswer === opt ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 2. Drag & Drop Code Block Assembly */}
          {currentActivity.type === 'drag_drop' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border-2 border-dashed border-emerald-500/40 rounded-2xl p-4 min-h-[70px] flex flex-wrap items-center gap-2">
                {draggedBlocks.length === 0 && (
                  <span className="text-xs text-slate-500 italic">Click available blocks below to construct your code statement...</span>
                )}
                {draggedBlocks.map((blk, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleRemoveBlock(idx)}
                    className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-code font-bold px-3 py-1.5 rounded-xl text-sm hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-300 transition shadow"
                  >
                    {blk} ×
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentActivity.blocks.map((blk, idx) => (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleBlockClick(blk)}
                    className="bg-slate-800 border border-slate-700 hover:border-emerald-400 font-code font-bold text-slate-200 px-3.5 py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95"
                  >
                    + {blk}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. CODE ORDERING (Interactive Line Reordering) */}
          {currentActivity.type === 'code_ordering' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">⬆⬇ Use arrows to reorder the lines into the correct Python sequence:</p>
              <div className="space-y-2">
                {orderedLines.map((line, idx) => {
                  // Count leading spaces to visualize indentation depth
                  const leadingSpaces = line.match(/^(\s*)/)[1].length;
                  const indentDepth = Math.floor(leadingSpaces / 4);
                  return (
                    <div
                      key={idx}
                      className={`bg-slate-950 border rounded-xl flex items-center gap-0 font-code text-sm text-emerald-300 shadow overflow-hidden ${
                        isAnswered ? 'border-slate-800' : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {/* Line number gutter */}
                      <span className="select-none font-bold text-slate-600 text-xs bg-slate-900 border-r border-slate-800 px-2 py-3 w-8 text-center shrink-0">
                        {idx + 1}
                      </span>

                      {/* Indentation depth color bars */}
                      {indentDepth > 0 && (
                        <div className="flex shrink-0 h-full">
                          {Array.from({ length: indentDepth }).map((_, di) => (
                            <div key={di} className="w-1 self-stretch" style={{
                              background: di === 0 ? '#10b981' : di === 1 ? '#6366f1' : '#f59e0b',
                              opacity: 0.4
                            }} />
                          ))}
                        </div>
                      )}

                      {/* Code line — whitespace-pre preserves indentation */}
                      <span className="flex-1 overflow-x-auto py-3 px-2 whitespace-pre font-code">{line}</span>

                      {!isAnswered && (
                        <div className="flex items-center gap-1 shrink-0 pr-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveLine(idx, -1)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 disabled:opacity-30 transition"
                            title="Move Up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === orderedLines.length - 1}
                            onClick={() => moveLine(idx, 1)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 disabled:opacity-30 transition"
                            title="Move Down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. MATCHING (Shuffled Match options) */}
          {currentActivity.type === 'matching' && currentActivity.pairs && (
            <div className="space-y-3">
              {currentActivity.pairs.map((p, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/80 p-3 border border-slate-800 rounded-2xl">
                  <span className="font-bold text-xs text-emerald-400 sm:w-1/3">{p.item}</span>
                  <div className="flex-1">
                    <select
                      value={selectedMatch[p.item] || ''}
                      disabled={isAnswered}
                      onChange={(e) => {
                        playSound('click');
                        setSelectedMatch({ ...selectedMatch, [p.item]: e.target.value });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="">-- Choose Matching Pair --</option>
                      {shuffledMatchOptions.map((mVal, mi) => (
                        <option key={mi} value={mVal}>{mVal}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Boss Battle */}
          {currentActivity.type === 'boss_battle' && (
            <div className="space-y-4 bg-slate-950/80 border border-rose-500/30 rounded-2xl p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl animate-bounce-slow">👹</span>
                  <div>
                    <h4 className="font-black text-base text-rose-400 font-display">{currentActivity.bossName}</h4>
                    <span className="text-xs text-slate-400 font-bold">Boss Health: {bossHp}/100</span>
                  </div>
                </div>
                <div className="w-40 bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <div className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-300" style={{ width: `${bossHp}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentActivity.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => { playSound('click'); setUserAnswer(opt); }}
                    className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm transition ${
                      userAnswer === opt
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="whitespace-pre-wrap leading-relaxed">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Speed Challenge */}
          {currentActivity.type === 'speed_challenge' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-4 py-3 rounded-2xl text-amber-400 text-xs font-extrabold">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>30s Rapid Speed Challenge</span>
                </div>
                <span className="text-base font-black">{timerSeconds}s</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentActivity.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={isAnswered || timerSeconds <= 0}
                    onClick={() => { playSound('click'); setUserAnswer(opt); }}
                    className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm transition ${
                      userAnswer === opt ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <span className="whitespace-pre-wrap">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. Actual Python Code Editor */}
          {currentActivity.type === 'actual_code' && (
            <div className="space-y-4">
              {/* Instruction Banner */}
              <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 text-xs text-amber-300 font-medium">
                <span className="text-base shrink-0">✏️</span>
                <span>Replace every <code className="bg-amber-500/20 px-1.5 py-0.5 rounded font-code font-bold">___</code> in the code below with your Python code, then click <strong>Run &amp; Test Code</strong>.</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>🐍 Python Code Editor</span>
                  <span className="text-emerald-400">Edit &amp; Execute</span>
                </div>

                <textarea
                  rows={Math.max(6, (userCode.match(/\n/g) || []).length + 2)}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  disabled={isAnswered}
                  spellCheck={false}
                  className="w-full bg-slate-950 border-2 border-slate-800 focus:border-emerald-400 rounded-2xl p-4 font-code text-sm text-emerald-300 focus:outline-none transition leading-relaxed resize-y"
                />
              </div>

              <button
                onClick={handleRunCode}
                disabled={isExecuting || isAnswered || userCode.includes('___')}
                className="btn-game-emerald px-5 py-3 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isExecuting ? 'Executing...' : 'Run & Test Code'}</span>
              </button>

              {(codeOutput || codeError) && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-code text-xs space-y-1">
                  <div className="text-slate-500 font-bold uppercase tracking-wider">Output</div>
                  {codeOutput && <div className="text-slate-200 whitespace-pre-wrap">{codeOutput}</div>}
                  {codeError && <div className="text-rose-400 font-bold whitespace-pre-wrap">{codeError}</div>}
                </div>
              )}
            </div>
          )}

          {/* Hint Request Button */}
          {!isAnswered && currentActivity.hints && (
            <div>
              <button
                onClick={() => {
                  playSound('click');
                  setShowHint(true);
                  setHintStage(prev => Math.min(prev + 1, currentActivity.hints.length));
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Need a Hint? (Stage {hintStage}/{currentActivity.hints.length})</span>
              </button>

              {showHint && hintStage > 0 && (
                <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 font-medium">
                  💡 <strong>Hint {hintStage}:</strong> {currentActivity.hints[hintStage - 1]}
                </div>
              )}
            </div>
          )}

          {/* Check / Submit Action Button */}
          {!isAnswered && currentActivity.type !== 'actual_code' && (
            <button
              onClick={() => handleEvaluateAnswer()}
              disabled={
                (currentActivity.type === 'drag_drop' && draggedBlocks.length === 0) ||
                (currentActivity.type === 'matching' && Object.keys(selectedMatch).length === 0)
              }
              className="w-full btn-game-emerald py-4 text-base tracking-wide disabled:opacity-40"
            >
              Check Solution
            </button>
          )}

          {/* Feedback & Explanation Box — Learn from Mistakes System */}
          {isAnswered && (
            <div className={`rounded-2xl border-2 space-y-0 animate-fade-in overflow-hidden ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : 'bg-rose-500/10 border-rose-500/40'
            }`}>

              {/* Result Header */}
              <div className={`flex items-center gap-3 px-5 py-4 font-black text-base font-display ${
                isCorrect ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-7 h-7 text-emerald-400 shrink-0" />
                    <div>
                      <div>{learnedFromMistake ? '🌟 You learned from your mistake!' : '🎉 Correct! Great thinking!'}</div>
                      {learnedFromMistake && <div className="text-xs font-medium text-emerald-400/80 mt-0.5">You got it right on the retry — that counts as learning! 💪</div>}
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
                    <div>
                      <div>❌ Not quite! But that's okay — let's learn from this.</div>
                      {mistakeCount > 0 && <div className="text-xs font-medium text-rose-400/80 mt-0.5">Attempt {mistakeCount + 1} — read the explanation and try again!</div>}
                    </div>
                  </>
                )}
              </div>

              {/* Correct Answer Reveal (on wrong) */}
              {!isCorrect && currentActivity.answer && (
                <div className="mx-5 mb-1 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black text-sm shrink-0 mt-0.5">✓ Correct Answer:</span>
                  <span className="text-emerald-300 font-bold text-sm font-code">{currentActivity.answer}</span>
                </div>
              )}
              {!isCorrect && currentActivity.correctOrder && !currentActivity.answer && (
                <div className="mx-5 mb-1 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <span className="text-emerald-400 font-black text-xs block mb-1">✓ Correct Order:</span>
                  <div className="space-y-1">
                    {currentActivity.correctOrder.map((line, i) => (
                      <div key={i} className="text-emerald-300 font-code text-xs">{i + 1}. {line}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              {currentActivity.explanation && (
                <div className="mx-5 mb-4 mt-2 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <p className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">📖 Why?</p>
                  <p className="text-sm text-slate-200 leading-relaxed">{currentActivity.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-5 pb-5 flex flex-col gap-3">
                {/* RETRY button — shown when wrong */}
                {!isCorrect && currentActivity.type !== 'actual_code' && (
                  <button
                    onClick={() => {
                      playSound('click');
                      setIsAnswered(false);
                      setIsCorrect(false);
                      setUserAnswer(null);
                      setDraggedBlocks([]);
                      setSelectedMatch({});
                      setRetryMode(true);
                    }}
                    className="w-full bg-amber-400 text-slate-950 font-black rounded-2xl py-3.5 px-6 text-sm shadow-[0_4px_0_#d97706] hover:bg-amber-300 active:translate-y-0.5 active:shadow-[0_2px_0_#d97706] transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again — I want to get it right! 💪</span>
                  </button>
                )}

                {/* NEXT / FINISH button */}
                <button
                  onClick={handleNextActivity}
                  className={`w-full py-3.5 px-6 text-sm font-black rounded-2xl flex items-center justify-center gap-2 transition-all ${
                    isCorrect
                      ? 'btn-game-emerald shadow-[0_4px_0_#059669]'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600 shadow-[0_4px_0_#374151]'
                  }`}
                >
                  <span>{activityIndex + 1 < levelData.activities.length
                    ? (isCorrect ? 'NEXT ACTIVITY →' : 'Skip & Continue Anyway')
                    : (isCorrect ? 'FINISH LEVEL 🎉' : 'Finish Level')
                  }</span>
                  {!isCorrect && <span className="text-xs opacity-60">(you can replay this level later)</span>}
                  {isCorrect && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
