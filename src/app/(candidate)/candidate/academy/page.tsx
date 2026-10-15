"use client";

import { useState } from "react";
import {
  Award,
  Zap,
  Code2,
  Cpu,
  ShieldCheck,
  Clock,
  Lock,
  ArrowRight,
  CheckCircle,
  X,
  FileText,
} from "@/components/ui/Icons";
import {
  ACADEMY_COURSES,
  TALENT_BADGES,
  CURRENT_TALENT_PROFILE,
  AcademyCourse,
} from "@/data/talentDashboardData";

export default function CandidateAcademyPage() {
  const [courses, setCourses] = useState<AcademyCourse[]>(ACADEMY_COURSES);
  const [badges, setBadges] = useState(TALENT_BADGES);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [examCourse, setExamCourse] = useState<AcademyCourse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [readinessScore, setReadinessScore] = useState(CURRENT_TALENT_PROFILE.readinessIndex);

  const filteredCourses = courses.filter((c) => {
    if (activeCategory === "all") return true;
    return c.category === activeCategory;
  });

  const handleStartResume = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextCompleted = Math.min(c.modulesCount, c.completedModules + 1);
          const nextProgress = Math.round((nextCompleted / c.modulesCount) * 100);
          return {
            ...c,
            completedModules: nextCompleted,
            progressPercentage: nextProgress,
            status: nextProgress === 100 ? "Completed" : "In Progress",
          };
        }
        return c;
      })
    );
    setSelectedCourse(null);
  };

  // Launch Exam Quiz
  const handleLaunchExam = (course: AcademyCourse) => {
    if (!course.examQuiz) return;
    setExamCourse(course);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamSubmitted(false);
    setExamScore(0);
    setSelectedCourse(null);
  };

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (examSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optionIdx });
  };

  const handleSubmitExam = () => {
    if (!examCourse?.examQuiz) return;
    const questions = examCourse.examQuiz.questions;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    setExamScore(percent);
    setExamSubmitted(true);

    if (percent >= 60) {
      // Mark course 100% completed
      setCourses((prev) =>
        prev.map((c) =>
          c.id === examCourse.id
            ? { ...c, completedModules: c.modulesCount, progressPercentage: 100, status: "Completed" }
            : c
        )
      );
      // Unlock badge
      setBadges((prev) =>
        prev.map((b) => (b.name === examCourse.badgeName ? { ...b, status: "Active" } : b))
      );
      // Boost readiness score
      setReadinessScore(Math.min(100, readinessScore + 4));
    }
  };

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 size={20} />;
      case "Cpu":
        return <Cpu size={20} />;
      case "ShieldCheck":
        return <ShieldCheck size={20} />;
      case "Clock":
        return <Clock size={20} />;
      case "Lock":
      default:
        return <Lock size={20} />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Readiness Index */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
              <span>Talent Upskilling Ecosystem</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              Pepoltek Talent Academy
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-ink-soft max-w-2xl leading-relaxed">
              Upskill through enterprise-accredited modules to unlock higher compensation tiers, specialized clinical rotas, and high-velocity engineering pods.
            </p>
          </div>

          <div className="flex items-center gap-5 rounded-2xl border border-electric/30 bg-canvas p-4 sm:p-5">
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-mist">Readiness Index</div>
              <div className="font-display text-3xl font-extrabold text-electric">
                {readinessScore}%
              </div>
            </div>
            <div className="h-10 w-px bg-[#bcd6fa]" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-mist">Tier Status</div>
              <div className="font-display text-xs sm:text-sm font-bold text-signal">
                {CURRENT_TALENT_PROFILE.vettingTier}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section (SRS FR-042 - Zero Emojis) */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-ink">Verified Capability Badge Vault</h2>
            <p className="text-xs text-ink-soft">Badges unlock higher rate brackets and priority invitation into elite client squads.</p>
          </div>
          <span className="font-mono text-xs text-electric font-semibold">
            {badges.filter((b) => b.status === "Active").length} Active • {badges.filter((b) => b.status === "In Progress").length} In-Flight
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 space-y-2.5 transition-all ${
                b.status === "Active"
                  ? "border-signal/40 bg-signal/5"
                  : b.status === "In Progress"
                  ? "border-electric/30 bg-electric/5"
                  : "border-[#bcd6fa]/50 bg-canvas/30 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    b.status === "Active"
                      ? "bg-signal text-white shadow-2xs"
                      : b.status === "In Progress"
                      ? "bg-electric text-white"
                      : "bg-[#bcd6fa] text-white"
                  }`}
                >
                  {renderBadgeIcon(b.iconName)}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9.5px] font-mono font-bold ${
                    b.status === "Active"
                      ? "bg-signal/15 text-signal"
                      : b.status === "In Progress"
                      ? "bg-electric/15 text-electric"
                      : "bg-[#bcd6fa]/50 text-mist"
                  }`}
                >
                  {b.level}
                </span>
              </div>

              <div>
                <div className="font-display text-xs font-bold text-ink leading-tight">{b.name}</div>
                <div className="text-[11px] text-signal font-semibold mt-0.5">{b.rateBoost}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Catalog (SRS FR-043) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/40 pb-3">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Enterprise Training & Diagnostic Modules</h2>
            <p className="text-xs text-ink-soft">Targeted tracks designed to bridge gap scores and prepare for direct client panel interviews.</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "All Modules", val: "all" },
              { label: "Software Architecture", val: "Software Architecture" },
              { label: "Healthcare Compliance", val: "Healthcare Compliance" },
              { label: "Enterprise Agile", val: "Enterprise Agile" },
            ].map((cat) => (
              <button
                key={cat.val}
                type="button"
                onClick={() => setActiveCategory(cat.val)}
                className={`rounded-xl px-3 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.val
                    ? "bg-ink text-white shadow-xs"
                    : "border border-[#bcd6fa]/60 bg-white text-ink-soft hover:bg-canvas"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-electric/70 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-electric/10 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-electric">
                    {course.category}
                  </span>
                  <span className="font-mono text-xs text-mist">{course.duration}</span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                  {course.title}
                </h3>
                <div className="text-xs text-ink-soft">Instructor: {course.instructor}</div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <div className="font-mono text-[11px] text-signal font-semibold">
                    Unlocks: {course.tierUnlockText}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-soft mb-1">
                    <span>Progress: {course.completedModules} of {course.modulesCount} Modules</span>
                    <span className="font-bold text-ink">{course.progressPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-canvas border border-[#bcd6fa]/40 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-electric to-electric-bright rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#bcd6fa]/30">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-all cursor-pointer"
                >
                  Syllabus ({course.syllabus.length})
                </button>

                {course.examQuiz && (
                  <button
                    type="button"
                    onClick={() => handleLaunchExam(course)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright transition-colors shadow-2xs cursor-pointer ml-auto"
                  >
                    <Zap size={14} />
                    <span>Take Skill Diagnostic Exam</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Course Syllabus Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200">
          <div className="w-full max-w-xl rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-electric">{selectedCourse.id}</span>
                <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-ink">{selectedCourse.title}</h3>
                <p className="text-xs text-ink-soft mt-0.5">{selectedCourse.category} • {selectedCourse.duration}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink mb-2.5">
                Course Module Syllabus ({selectedCourse.completedModules}/{selectedCourse.modulesCount} Completed)
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedCourse.syllabus.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-xl p-3 text-xs border ${
                      index < selectedCourse.completedModules
                        ? "border-signal/30 bg-signal/5 text-ink"
                        : "border-[#bcd6fa]/50 bg-canvas/30 text-ink-soft"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-mist">0{index + 1}</span>
                      <span>{item}</span>
                    </div>
                    {index < selectedCourse.completedModules ? (
                      <span className="font-mono text-[10px] font-bold text-signal">COMPLETED</span>
                    ) : (
                      <span className="font-mono text-[10px] text-mist">PENDING</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedCourse.examQuiz && (
                  <button
                    type="button"
                    onClick={() => handleLaunchExam(selectedCourse)}
                    className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright transition-colors cursor-pointer shadow-xs"
                  >
                    Take Exam Now →
                  </button>
                )}
                {selectedCourse.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={() => handleStartResume(selectedCourse.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    <span>Complete Next (+1)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Skill Diagnostic & Exam Quiz Modal */}
      {examCourse && examCourse.examQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200">
          <div
            className="w-full max-w-xl rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-electric">
                  <Award size={12} />
                  <span>OFFICIAL SKILL DIAGNOSTIC EXAM</span>
                </div>
                <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-ink">
                  {examCourse.title}
                </h3>
                <p className="text-xs text-ink-soft">
                  Answer the architectural scenario questions to verify competency and unlock the <strong>{examCourse.badgeName}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setExamCourse(null)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Exam Body */}
            {!examSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-electric font-mono">
                    Question {currentQuestionIndex + 1} of {examCourse.examQuiz.questions.length}
                  </span>
                  <span className="text-mist">Passing Threshold: 60%</span>
                </div>

                <div className="p-4 rounded-2xl bg-canvas/40 border border-[#bcd6fa]/50 text-xs font-medium text-ink leading-relaxed">
                  {examCourse.examQuiz.questions[currentQuestionIndex].questionText}
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {examCourse.examQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? "border-electric bg-electric/10 text-ink shadow-2xs font-semibold"
                            : "border-[#bcd6fa]/60 bg-white hover:bg-canvas/40 text-ink-soft"
                        }`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                          isSelected ? "border-electric bg-electric text-white" : "border-mist text-mist"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation */}
                <div className="flex items-center justify-between pt-3 border-t border-[#bcd6fa]/40">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    className="rounded-xl px-4 py-2 border border-[#bcd6fa] text-xs font-semibold text-ink-soft hover:bg-canvas disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>

                  {currentQuestionIndex < examCourse.examQuiz.questions.length - 1 ? (
                    <button
                      type="button"
                      disabled={selectedAnswers[currentQuestionIndex] === undefined}
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      className="rounded-xl bg-electric px-5 py-2 text-xs font-bold text-white hover:bg-electric-bright disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={Object.keys(selectedAnswers).length < examCourse.examQuiz.questions.length}
                      onClick={handleSubmitExam}
                      className="rounded-xl bg-signal px-5 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      Submit Exam for Evaluation
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Exam Result Screen */
              <div className="text-center py-4 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto bg-signal/20 text-signal border-2 border-signal shadow-md">
                  <CheckCircle size={32} />
                </div>

                <div>
                  <h4 className="font-display text-xl font-extrabold text-ink">
                    Exam Passed with {examScore}% Score!
                  </h4>
                  <p className="text-xs text-ink-soft mt-1 max-w-md mx-auto">
                    Congratulations! You have verified your competence in <strong>{examCourse.title}</strong>. Your profile readiness index increased by +4%.
                  </p>
                </div>

                {/* Awarded Badge Box */}
                <div className="rounded-2xl border border-signal/40 bg-signal/5 p-4 max-w-sm mx-auto text-center space-y-1">
                  <span className="font-mono text-[10px] text-signal font-bold uppercase">Badge Successfully Awarded</span>
                  <div className="font-display text-sm font-extrabold text-ink">{examCourse.badgeName}</div>
                  <div className="text-[11px] text-mist">{examCourse.tierUnlockText}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setExamCourse(null)}
                  className="rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer"
                >
                  Return to Academy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
