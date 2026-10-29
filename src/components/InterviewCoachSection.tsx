import React, { useState, useEffect, useRef } from "react";
import {
  HelpCircle,
  Play,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Mic,
  MicOff,
  Send,
  Award,
  AlertCircle,
  Lightbulb,
  Copy,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { InterviewQuestion, EvaluationResult } from "../types";

interface InterviewCoachSectionProps {
  questions: InterviewQuestion[];
  targetRole: string;
  focusSkillQuery?: string;
}

export const InterviewCoachSection: React.FC<InterviewCoachSectionProps> = ({
  questions,
  targetRole,
  focusSkillQuery = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(questions[0]?.id || null);
  const [activePracticeId, setActivePracticeId] = useState<string | null>(null);

  // Practice state
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<Record<string, EvaluationResult>>({});
  const [isListening, setIsListening] = useState<boolean>(false);
  const [copiedAnswer, setCopiedAnswer] = useState<boolean>(false);
  const [coachNotification, setCoachNotification] = useState<string | null>(null);
  const showNotification = (msg: string) => { setCoachNotification(msg); setTimeout(() => setCoachNotification(null), 4000); };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Speech Recognition Setup if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setUserAnswer((prev) => (prev ? prev + " " + transcript : transcript));
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("Speech recognition initialization error", err);
      }
    }
  }, []);

  const toggleSpeech = () => {
    if (!recognitionRef.current) {
      showNotification("Speech recognition is not supported in this browser. Please type your response.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if (!isTimerRunning) setIsTimerRunning(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleStartPractice = (questionId: string) => {
    setActivePracticeId(questionId);
    setExpandedId(questionId);
    setUserAnswer("");
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleEvaluateAnswer = async (q: InterviewQuestion) => {
    if (!userAnswer || userAnswer.trim().length < 10) return;
    setIsEvaluating(true);
    handleStopTimer();

    try {
      const res = await fetch("/api/evaluate-interview-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          questionCategory: q.categoryLabel || q.category,
          userTranscriptOrText: userAnswer,
          targetRole,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        showNotification(typeof json?.error === "string" ? json.error : "Request failed. Please try again.");
        return;
      }
      if (json?.success && json.data && typeof json.data === "object") {
        setEvaluation((prev) => ({
          ...prev,
          [q.id]: json.data,
        }));
        if (json.data.score >= 8) {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
      } else {
        showNotification(json.error || "Failed to evaluate answer. Please try again.");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error evaluating answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory =
      selectedCategory === "all" || q.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSkill =
      !focusSkillQuery ||
      q.question.toLowerCase().includes(focusSkillQuery.toLowerCase()) ||
      q.contextWhyAsked.toLowerCase().includes(focusSkillQuery.toLowerCase());
    return matchesCategory && matchesSkill;
  });

  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case "technical":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "behavioral":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "situational":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "gap_defense":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-700/60 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Practice Interview Questions &amp; Interactive Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Targeted for {targetRole}. Practice typing or speaking your answers, get instant AI evaluation, and learn how to defend missing skills.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedCategory === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setSelectedCategory("technical")}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedCategory === "technical" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Technical
          </button>
          <button
            onClick={() => setSelectedCategory("gap_defense")}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedCategory === "gap_defense" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Skill Gap Defense
          </button>
          <button
            onClick={() => setSelectedCategory("behavioral")}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedCategory === "behavioral" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Behavioral
          </button>
          <button
            onClick={() => setSelectedCategory("situational")}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedCategory === "situational" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Situational
          </button>
        </div>
      </div>

      {coachNotification && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{coachNotification}</span>
          </div>
          <button type="button" onClick={() => setCoachNotification(null)} className="text-amber-400 hover:text-white transition text-xs font-semibold">Dismiss</button>
        </div>
      )}

      {/* Questions Accordion / Interactive Practice Cards */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          const isPracticing = activePracticeId === q.id;
          const currentEval = evaluation[q.id];

          return (
            <div
              key={q.id || idx}
              className={`border rounded-2xl transition duration-200 overflow-hidden ${
                isPracticing
                  ? "bg-slate-950/90 border-indigo-500/60 shadow-xl shadow-indigo-950/30"
                  : isExpanded
                  ? "bg-slate-950/70 border-slate-700/80"
                  : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700/60"
              }`}
            >
              {/* Question Row Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(
                        q.category
                      )}`}
                    >
                      {q.categoryLabel || q.category}
                    </span>
                    {q.category.toLowerCase().includes("gap") && (
                      <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Overcomes Missing Skills
                      </span>
                    )}
                    {currentEval && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Evaluated: {currentEval.score}/10
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {idx + 1}. {q.question}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartPractice(q.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isPracticing
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700"
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isPracticing ? "Practicing" : "Practice"}</span>
                  </button>

                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Question Details & Interactive Workspace */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4">
                  {/* Context of why question is asked */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                      <span className="font-semibold text-indigo-300 uppercase tracking-wider block text-[10px] mb-1 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> Why The Interviewer Asks This:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{q.contextWhyAsked}</p>
                    </div>

                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                      <span className="font-semibold text-emerald-300 uppercase tracking-wider block text-[10px] mb-1 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Tips &amp; STAR Structure Guide:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{q.tipsOrStarGuide}</p>
                    </div>
                  </div>

                  {/* Interactive Practice Workspace */}
                  {isPracticing && (
                    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-indigo-500/40 space-y-3.5 shadow-inner">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-xs font-bold uppercase tracking-wider text-white">
                            Interactive Mock Practice Mode
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Timer display */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 text-xs font-mono font-bold text-slate-200 border border-slate-800">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{formatTimer(timerSeconds)}</span>
                          </div>

                          {/* Voice toggle button */}
                          <button
                            type="button"
                            onClick={toggleSpeech}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                              isListening
                                ? "bg-rose-600 text-white animate-pulse"
                                : "bg-slate-800 text-slate-300 hover:text-white"
                            }`}
                            title="Toggle speech to text"
                          >
                            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                            <span>{isListening ? "Listening..." : "Dictate"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Text area for user response */}
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type or dictate your answer here as if speaking to the interviewer... Practice using the STAR method (Situation, Task, Action, Result)!"
                        rows={4}
                        className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
                      />

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                        </span>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePracticeId(null);
                              handleStopTimer();
                            }}
                            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            disabled={isEvaluating || userAnswer.trim().length < 10}
                            onClick={() => handleEvaluateAnswer(q)}
                            className={`px-4 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                              isEvaluating || userAnswer.trim().length < 10
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:brightness-110 shadow-md shadow-indigo-600/30"
                            }`}
                          >
                            {isEvaluating ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Evaluating with AI...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Evaluate My Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Evaluation Feedback Card */}
                  {currentEval && (
                    <div className="bg-slate-900/95 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-indigo-400" />
                          <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                            AI Evaluation &amp; Coaching Feedback
                          </h5>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-indigo-300">
                            Score: {currentEval.score}/10
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                            {currentEval.scoreLabel}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                          <span className="font-bold text-emerald-400 block text-[11px]">
                            What You Did Well:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300">
                            {currentEval.strengthsInAnswer.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20 space-y-1">
                          <span className="font-bold text-amber-400 block text-[11px]">
                            Opportunities to Elevate:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300">
                            {currentEval.improvementsNeeded.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Polished candidate response */}
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/30 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-300 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            Polished Model Answer (Preserving Your Background):
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(currentEval.polishedAnswer)}
                            className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                          >
                            {copiedAnswer ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAnswer ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                        <p className="text-slate-200 leading-relaxed italic">
                          &ldquo;{currentEval.polishedAnswer}&rdquo;
                        </p>
                      </div>

                      <div className="text-[11px] text-sky-300 bg-sky-950/30 p-2.5 rounded-xl border border-sky-800/30">
                        <strong>Key Takeaway:</strong> {currentEval.keyTakeawayTip}
                      </div>
                    </div>
                  )}

                  {/* Standard Model Answer Box */}
                  <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                      Benchmark Exemplary Response:
                    </span>
                    <p className="text-slate-300 leading-relaxed italic">
                      &ldquo;{q.sampleGoodResponse}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
