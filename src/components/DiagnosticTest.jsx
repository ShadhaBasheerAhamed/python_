import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

const DIAGNOSTIC_QUESTIONS = [
  {
    question: "1. What is the output of print(3 + 4 * 2)?",
    options: ["14", "11", "24", "Error"],
    answer: "11"
  },
  {
    question: "2. Which keyword is used to start a loop in Python?",
    options: ["loop", "repeat", "for", "iterate"],
    answer: "for"
  },
  {
    question: "3. What is the result of len([10, 20, 30])?",
    options: ["2", "3", "30", "10"],
    answer: "3"
  },
  {
    question: "4. What does def greet(): do in Python?",
    options: ["Defines a variable", "Defines a function", "Prints greet", "Deletes greet"],
    answer: "Defines a function"
  }
];

export default function DiagnosticTest({ onCompleteDiagnostic, onCancel }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [recommendedLevel, setRecommendedLevel] = useState(1);

  const handleSelectOption = (opt) => {
    playSound('click');
    setAnswers({ ...answers, [currentIdx]: opt });
  };

  const handleNext = () => {
    playSound('click');
    if (currentIdx + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate score & placement
      let correct = 0;
      DIAGNOSTIC_QUESTIONS.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });

      let level = 1;
      if (correct === 4) level = 7; // Intermediate
      else if (correct >= 2) level = 4; // Beginner
      else level = 1;

      setRecommendedLevel(level);
      setFinished(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>PYTHON DIAGNOSTIC TEST</span>
          </div>
          <button onClick={onCancel} className="text-xs text-slate-400 hover:text-white">Cancel</button>
        </div>

        {!finished ? (
          <div className="space-y-4">
            <span className="text-xs text-slate-400 font-bold">Question {currentIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
            <h3 className="text-lg font-extrabold text-white">{DIAGNOSTIC_QUESTIONS[currentIdx].question}</h3>

            <div className="grid grid-cols-1 gap-2.5">
              {DIAGNOSTIC_QUESTIONS[currentIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 rounded-xl border text-left text-sm font-medium transition ${
                    answers[currentIdx] === opt
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              disabled={!answers[currentIdx]}
              onClick={handleNext}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>{currentIdx + 1 < DIAGNOSTIC_QUESTIONS.length ? 'Next Question' : 'Complete Diagnostic'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 text-4xl">
              🎯
            </div>
            <h3 className="text-2xl font-black text-white">Diagnostic Complete!</h3>
            <p className="text-xs text-slate-300">
              Based on your answers, we recommend starting at:
            </p>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-indigo-500/40 text-indigo-300 text-lg font-black">
              Recommended: Level {recommendedLevel}
            </div>

            <button
              onClick={() => onCompleteDiagnostic(recommendedLevel)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl transition"
            >
              BEGIN QUEST AT LEVEL {recommendedLevel}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
