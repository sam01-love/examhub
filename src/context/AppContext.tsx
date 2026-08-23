import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ExamCategory,
  SubjectId,
  StudentProgress,
  ExamAttempt,
  PracticeSession,
} from '../types';

export type UserRole = 'public' | 'student' | 'admin';

export type NavigationTab =
  // Public Tabs
  | 'home'
  | 'tutorials'
  | 'about'
  | 'contact'
  | 'login'
  | 'register'
  // Student Portal Tabs
  | 'student-dashboard'
  | 'my-courses'
  | 'past-questions'
  | 'cbt'
  | 'results'
  | 'progress'
  | 'ai-tutor'
  // Admin Portal Tabs
  | 'admin-dashboard';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  targetExam: ExamCategory;
  department?: string;
  avatarUrl?: string;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  loginUser: (email: string, role: UserRole, name?: string) => void;
  logoutUser: () => void;

  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedExam: ExamCategory;
  setSelectedExam: (exam: ExamCategory) => void;
  selectedSubjectId: SubjectId;
  setSelectedSubjectId: (subjectId: SubjectId) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (topicId: string | null) => void;

  // Progress & History
  studentProgress: StudentProgress;
  examAttempts: ExamAttempt[];
  practiceSessions: PracticeSession[];

  // Actions
  saveExamAttempt: (attempt: ExamAttempt) => void;
  savePracticeSession: (session: PracticeSession) => void;
  updateCustomTopicVideo: (topicId: string, videoUrl: string) => void;
  toggleQuestionBookmark: (questionId: string) => void;
  updateTopicMastery: (topicId: string, percentage: number) => void;
  resetAllData: () => void;

  // Modal / AI helpers
  aiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;
  aiPromptContext: { question?: string; options?: any[]; correctAnswer?: string; userSelectedAnswer?: string; subject?: string } | null;
  openAiModalForQuestion: (context: { question: string; options?: any[]; correctAnswer?: string; userSelectedAnswer?: string; subject?: string }) => void;

  // Splash Screen Intro Control
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  triggerSplash: () => void;
}

const DEFAULT_PROGRESS: StudentProgress = {
  totalQuestionsSolved: 28,
  totalExamsTaken: 3,
  averageScorePercentage: 74,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  topicMastery: {
    'phy-1': 85,
    'phy-2': 70,
    'math-1': 90,
    'chem-1': 65,
    'eng-1': 80,
  },
  bookmarkedQuestionIds: ['phy-q1', 'mth-q2-fixed'],
  customTopicVideos: {},
};

const INITIAL_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'attempt-1',
    timestamp: Date.now() - 86400000 * 2,
    formattedDate: '2 days ago',
    examCategory: 'JAMB',
    subjects: ['english', 'maths', 'physics', 'chemistry'],
    totalQuestions: 40,
    totalCorrect: 32,
    scorePercentage: 80,
    timeSpentSeconds: 1120,
    timeLimitSeconds: 1800,
    subjectBreakdown: {
      english: { total: 10, correct: 9, wrong: 1, skipped: 0 },
      maths: { total: 10, correct: 8, wrong: 2, skipped: 0 },
      physics: { total: 10, correct: 7, wrong: 3, skipped: 0 },
      chemistry: { total: 10, correct: 8, wrong: 2, skipped: 0 },
    } as any,
    userAnswers: {},
    flaggedQuestions: [],
  },
  {
    id: 'attempt-2',
    timestamp: Date.now() - 86400000 * 5,
    formattedDate: '5 days ago',
    examCategory: 'POST_UTME',
    subjects: ['physics', 'maths', 'chemistry'],
    totalQuestions: 30,
    totalCorrect: 21,
    scorePercentage: 70,
    timeSpentSeconds: 900,
    timeLimitSeconds: 1200,
    subjectBreakdown: {
      physics: { total: 10, correct: 7, wrong: 3, skipped: 0 },
      maths: { total: 10, correct: 8, wrong: 2, skipped: 0 },
      chemistry: { total: 10, correct: 6, wrong: 4, skipped: 0 },
    } as any,
    userAnswers: {},
    flaggedQuestions: [],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedExam, setSelectedExam] = useState<ExamCategory>('JAMB');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('physics');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const loginUser = (email: string, role: UserRole, name?: string) => {
    setUserRole(role);
    setCurrentUser({
      name: name || (role === 'admin' ? 'Administrator' : 'Student User'),
      email: email || (role === 'admin' ? 'admin@examhub.ng' : 'student@examhub.ng'),
      role,
      targetExam: selectedExam,
      department: role === 'admin' ? 'System Management' : 'Science & Tech',
    });
    if (role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('student-dashboard');
    }
  };

  const logoutUser = () => {
    setUserRole('public');
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Persistence in LocalStorage
  const [studentProgress, setStudentProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem('examhub_student_progress');
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('examhub_exam_attempts');
      return saved ? JSON.parse(saved) : INITIAL_EXAM_ATTEMPTS;
    } catch {
      return INITIAL_EXAM_ATTEMPTS;
    }
  });

  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>(() => {
    try {
      const saved = localStorage.getItem('examhub_practice_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiPromptContext, setAiPromptContext] = useState<{ question?: string; options?: any[]; correctAnswer?: string; userSelectedAnswer?: string; subject?: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('examhub_student_progress', JSON.stringify(studentProgress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [studentProgress]);

  useEffect(() => {
    try {
      localStorage.setItem('examhub_exam_attempts', JSON.stringify(examAttempts));
    } catch (e) {
      console.error('Failed to save exam attempts to localStorage', e);
    }
  }, [examAttempts]);

  useEffect(() => {
    try {
      localStorage.setItem('examhub_practice_sessions', JSON.stringify(practiceSessions));
    } catch (e) {
      console.error('Failed to save practice sessions to localStorage', e);
    }
  }, [practiceSessions]);

  const saveExamAttempt = (attempt: ExamAttempt) => {
    setExamAttempts((prev) => [attempt, ...prev]);
    // update student summary stats
    setStudentProgress((prev) => {
      const newTotalExams = prev.totalExamsTaken + 1;
      const newSolved = prev.totalQuestionsSolved + attempt.totalQuestions;
      const allPercentages = [attempt.scorePercentage, ...examAttempts.map((a) => a.scorePercentage)];
      const avg = Math.round(allPercentages.reduce((a, b) => a + b, 0) / allPercentages.length);

      return {
        ...prev,
        totalExamsTaken: newTotalExams,
        totalQuestionsSolved: newSolved,
        averageScorePercentage: avg,
      };
    });
  };

  const savePracticeSession = (session: PracticeSession) => {
    setPracticeSessions((prev) => [session, ...prev]);
    setStudentProgress((prev) => ({
      ...prev,
      totalQuestionsSolved: prev.totalQuestionsSolved + session.totalAttempted,
    }));
  };

  const updateCustomTopicVideo = (topicId: string, videoUrl: string) => {
    setStudentProgress((prev) => ({
      ...prev,
      customTopicVideos: {
        ...prev.customTopicVideos,
        [topicId]: videoUrl,
      },
    }));
  };

  const toggleQuestionBookmark = (questionId: string) => {
    setStudentProgress((prev) => {
      const isBookmarked = prev.bookmarkedQuestionIds.includes(questionId);
      const newBookmarks = isBookmarked
        ? prev.bookmarkedQuestionIds.filter((id) => id !== questionId)
        : [...prev.bookmarkedQuestionIds, questionId];
      return {
        ...prev,
        bookmarkedQuestionIds: newBookmarks,
      };
    });
  };

  const updateTopicMastery = (topicId: string, percentage: number) => {
    setStudentProgress((prev) => ({
      ...prev,
      topicMastery: {
        ...prev.topicMastery,
        [topicId]: Math.min(100, Math.max(0, percentage)),
      },
    }));
  };

  const resetAllData = () => {
    setStudentProgress(DEFAULT_PROGRESS);
    setExamAttempts(INITIAL_EXAM_ATTEMPTS);
    setPracticeSessions([]);
    localStorage.removeItem('examhub_student_progress');
    localStorage.removeItem('examhub_exam_attempts');
    localStorage.removeItem('examhub_practice_sessions');
  };

  const [showSplash, setShowSplash] = useState(true);

  const triggerSplash = () => {
    setShowSplash(true);
  };

  const openAiModalForQuestion = (context: { question: string; options?: any[]; correctAnswer: string; userSelectedAnswer?: string; subject?: string }) => {
    setAiPromptContext(context);
    setAiModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        loginUser,
        logoutUser,
        activeTab,
        setActiveTab,
        selectedExam,
        setSelectedExam,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedTopicId,
        setSelectedTopicId,
        studentProgress,
        examAttempts,
        practiceSessions,
        saveExamAttempt,
        savePracticeSession,
        updateCustomTopicVideo,
        toggleQuestionBookmark,
        updateTopicMastery,
        resetAllData,
        aiModalOpen,
        setAiModalOpen,
        aiPromptContext,
        openAiModalForQuestion,
        showSplash,
        setShowSplash,
        triggerSplash,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
