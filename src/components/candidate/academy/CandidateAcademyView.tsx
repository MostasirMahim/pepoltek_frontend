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
import { AcademyCourse } from "@/types/candidate.types";
import {
  getAcademyCoursesAction,
  enrollCourseAction,
} from "@/actions/academy.actions";

import { useCandidatePersona } from "@/context/CandidatePersonaContext";

interface CandidateAcademyViewProps {
  initialCourses?: AcademyCourse[];
}

export function CandidateAcademyView({
  initialCourses = [],
}: CandidateAcademyViewProps) {
  const { currentProfile, updateCurrentProfile } = useCandidatePersona();
  const [courses, setCourses] = useState<AcademyCourse[]>(initialCourses);
  const [badges, setBadges] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [examCourse, setExamCourse] = useState<AcademyCourse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const readinessScore = currentProfile.readinessIndex;

  const filteredCourses = courses.filter((c) => {
    if (activeCategory === "all") return true;
    return c.category === activeCategory;
  });

  const handleStartResume = async (courseId: string) => {
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

    await enrollCourseAction(courseId);
    setSelectedCourse(null);
  };

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
      setCourses((prev) =>
        prev.map((c) =>
          c.id === examCourse.id
            ? { ...c, completedModules: c.modulesCount, progressPercentage: 100, status: "Completed" }
            : c
        )
      );
      setBadges((prev) =>
        prev.map((b) => (b.name === examCourse.badgeName ? { ...b, status: "Active" } : b))
      );
      updateCurrentProfile({ readinessIndex: Math.min(100, currentProfile.readinessIndex + 4) });
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
      {/* Header & Readiness Index - Responsive Mobile & Desktop */}
      <div className="rounded-2xl sm:rounded-3xl border border-[#bcd6fa] bg-white p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
              <span className={`h-2 w-2 rounded-full ${currentProfile.primaryTrack === "healthcare" ? "bg-emerald-500" : "bg-electric"}`} />
              <span>
                {currentProfile.primaryTrack === "healthcare" ? "Healthcare & Clinical Academy" : "Technology & Engineering Academy"}
              </span>
            </div>
            <h1 className="mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink">
              Pepoltek Talent Academy
            </h1>
            <p className="mt-1 text-[11.5px] sm:text-xs md:text-sm text-ink-soft max-w-2xl leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              Upskill through enterprise-accredited modules to unlock higher compensation tiers, specialized clinical rotas, and high-velocity engineering pods.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-5 rounded-xl sm:rounded-2xl border border-electric/30 bg-canvas p-2.5 sm:p-4 lg:p-5">
            <div className="text-left sm:text-right">
              <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-mist">Readiness Index</div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-electric">
                {readinessScore}%
              </div>
            </div>
            <div className="h-8 sm:h-10 w-px bg-[#bcd6fa]" />
            <div>
              <div className="font-display text-xs sm:text-sm font-bold text-ink">Tier 1 Squad Ready</div>
              <div className="text-[10px] sm:text-[11px] text-signal font-semibold">Top 5% Placement Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">Earned Credentials &amp; Deployable Badges</h2>
          <span className="font-mono text-xs text-mist">
            {badges.filter((b) => b.status === "Active").length} of {badges.length} Unlocked
          </span>
        </div>

        {badges.length === 0 ? (
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-6 text-center text-xs shadow-xs space-y-1">
            <div className="font-display font-bold text-ink">No Badges Unlocked Yet</div>
            <p className="text-ink-soft text-[11px]">
              Complete technical diagnostics or sprint orientation modules to earn verified talent badges.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {badges.map((badge) => {
              const isActive = badge.status === "Active";
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    isActive
                      ? "border-electric/50 bg-white shadow-2xs"
                      : "border-[#bcd6fa]/40 bg-canvas/30 opacity-60"
                  }`}
                >
                  <div
                    className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl mb-2.5 ${
                      isActive ? "bg-electric text-white shadow-xs" : "bg-canvas text-mist"
                    }`}
                  >
                    {renderBadgeIcon(badge.iconName)}
                  </div>
                  <div className="font-display text-xs font-bold text-ink truncate">{badge.name}</div>
                  <div className="font-mono text-[10px] text-mist mt-0.5">{badge.earnedDate}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Courses Section with Filter Strip */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: "All Modules" },
              { id: "Software Architecture", label: "Software Architecture" },
              { id: "Healthcare Compliance", label: "Healthcare & Compliance" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-ink text-white shadow-xs"
                    : "text-ink-soft hover:bg-canvas hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="font-mono text-[11px] text-mist pr-2">
            Showing {filteredCourses.length} of {courses.length} courses
          </span>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-8 sm:p-10 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
              <Award size={22} />
            </div>
            <h3 className="font-display text-base font-bold text-ink">No Academy Courses in Flight</h3>
            <p className="mt-1 text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
              You are not currently enrolled in any Academy courses. As sprint requirements and technical tracks are assigned, training modules will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs hover:border-electric/70 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-soft">
                      {course.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        course.status === "Completed"
                          ? "bg-signal/15 text-signal"
                          : course.status === "In Progress"
                          ? "bg-electric/15 text-electric"
                          : "bg-canvas text-mist"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-ink leading-snug">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-3 font-mono text-xs text-mist">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>{course.duration}</span>
                    </span>
                    <span>•</span>
                    <span>{course.modulesCount} Modules</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-ink-soft">{course.completedModules} of {course.modulesCount} Complete</span>
                      <span className="font-bold text-electric">{course.progressPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-canvas overflow-hidden border border-[#bcd6fa]/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-electric to-electric-bright"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-electric/20 bg-electric/5 p-2.5 text-[11px] text-ink flex items-center gap-2">
                    <Award size={15} className="text-electric shrink-0" />
                    <span className="truncate">Reward: <strong>{course.badgeName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#bcd6fa]/30">
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 rounded-xl border border-[#bcd6fa] bg-canvas/40 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-all cursor-pointer text-center"
                  >
                    Syllabus
                  </button>

                  {course.examQuiz ? (
                    <button
                      type="button"
                      onClick={() => handleLaunchExam(course)}
                      className="flex-1 rounded-xl bg-electric py-2 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-xs text-center"
                    >
                      Take Exam
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartResume(course.id)}
                      className="flex-1 rounded-xl bg-ink py-2 font-display text-xs font-bold text-white hover:bg-electric transition-all cursor-pointer shadow-xs text-center"
                    >
                      {course.status === "Completed" ? "Review" : "Continue"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Syllabus Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-lg rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <span className="font-mono text-xs text-electric font-semibold">{selectedCourse.category}</span>
                <h3 className="font-display text-lg font-bold text-ink mt-0.5">{selectedCourse.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="font-display text-xs font-bold text-ink uppercase tracking-wider">Course Modules &amp; Objectives</div>
              <div className="space-y-2">
                {selectedCourse.syllabus.map((mod, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-electric text-white font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-ink font-medium">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between text-xs">
              <span className="text-mist font-mono">{selectedCourse.duration} total duration</span>
              <button
                type="button"
                onClick={() => handleStartResume(selectedCourse.id)}
                className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright cursor-pointer shadow-xs"
              >
                Start Next Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timed Exam Quiz Modal */}
      {examCourse?.examQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-xl rounded-3xl border border-electric/40 bg-white p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-electric">
                  <Award size={12} />
                  <span>SPECIALIST EVALUATION EXAM</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  {examCourse.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setExamCourse(null)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {!examSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-mist">
                  <span>Question {currentQuestionIndex + 1} of {examCourse.examQuiz.questions.length}</span>
                  <span className="text-signal font-bold">60% Required to Pass</span>
                </div>

                <div className="p-4 rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 text-sm font-semibold text-ink">
                  {examCourse.examQuiz.questions[currentQuestionIndex].questionText}
                </div>

                <div className="space-y-2">
                  {examCourse.examQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "border-electric bg-electric/10 text-ink font-bold ring-1 ring-electric/30"
                            : "border-[#bcd6fa]/60 bg-white text-ink-soft hover:border-electric/50"
                        }`}
                      >
                        <span className="font-mono text-mist mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#bcd6fa]/40">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>

                  {currentQuestionIndex < examCourse.examQuiz.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric cursor-pointer shadow-xs"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitExam}
                      className="rounded-xl bg-signal px-6 py-2 font-display text-xs font-bold text-ink hover:bg-emerald-400 cursor-pointer shadow-xs"
                    >
                      Submit Evaluation
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl ${
                    examScore >= 60 ? "bg-signal text-ink" : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {examScore >= 60 ? <CheckCircle size={32} /> : <X size={32} />}
                </div>

                <div>
                  <h4 className="font-display text-2xl font-bold text-ink">
                    {examScore >= 60 ? "Evaluation Passed!" : "Score Below Passing Mark"}
                  </h4>
                  <div className="font-mono text-lg font-bold text-electric mt-1">
                    Score: {examScore}%
                  </div>
                  <p className="text-xs text-ink-soft mt-1">
                    {examScore >= 60
                      ? `Congratulations! Badge "${examCourse.badgeName}" unlocked and your Readiness Index increased.`
                      : "Review the module syllabus and attempt the evaluation again in 24 hours."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setExamCourse(null)}
                  className="rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-bold text-white hover:bg-electric cursor-pointer shadow-xs"
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
