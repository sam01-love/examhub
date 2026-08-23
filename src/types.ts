export type ExamCategory = 'JAMB' | 'WAEC' | 'POST_UTME';

export type SubjectCategory = 'SCIENCE' | 'ARTS' | 'COMMERCIAL';

export type SubjectId =
  | 'english'
  | 'maths'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'literature'
  | 'government'
  | 'crk'
  | 'economics'
  | 'accounting'
  | 'commerce'
  | 'geography'
  | 'agric';

export interface Subject {
  id: SubjectId;
  name: string;
  category: SubjectCategory;
  iconName: string;
  description: string;
  topicsCount: number;
  color: string;
  bgColor: string;
}

export interface SubTopic {
  id: string;
  name: string;
  description: string;
  keyPoints: string[];
}

export interface SyllabusTopic {
  id: string;
  subjectId: SubjectId;
  examCategory: ExamCategory;
  topicName: string;
  description: string;
  subtopics: SubTopic[];
  frequency: 'High' | 'Medium' | 'Low';
  importanceNote: string;
}

export interface Option {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  examCategory: ExamCategory;
  year: number;
  topic: string;
  questionText: string;
  options: Option[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  workedSteps?: string[];
  isOauSpecial?: boolean;
}

export interface ReadingMaterial {
  id: string;
  subjectId: SubjectId;
  topicId: string;
  topicTitle: string;
  introduction: string;
  contentMarkdown: string;
  defaultVideoUrl: string; // YouTube embed URL
  keyFormulas?: { name: string; formula: string; note: string }[];
  workedExamples: {
    title: string;
    question: string;
    solution: string;
  }[];
  quickQuiz: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ExamAttempt {
  id: string;
  timestamp: number;
  formattedDate: string;
  examCategory: ExamCategory;
  subjects: SubjectId[];
  totalQuestions: number;
  totalCorrect: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  subjectBreakdown: Record<SubjectId, { total: number; correct: number; wrong: number; skipped: number }>;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | null>; // questionId -> option
  flaggedQuestions: string[];
}

export interface PracticeSession {
  id: string;
  timestamp: number;
  formattedDate: string;
  subjectId: SubjectId;
  yearFilter?: string;
  topicFilter?: string;
  totalAttempted: number;
  totalCorrect: number;
  scorePercentage: number;
}

export interface StudentProgress {
  totalQuestionsSolved: number;
  totalExamsTaken: number;
  averageScorePercentage: number;
  streakDays: number;
  lastActiveDate: string;
  topicMastery: Record<string, number>; // topicId -> percentage 0..100
  bookmarkedQuestionIds: string[];
  customTopicVideos: Record<string, string>; // topicId -> user custom video URL
}

export interface NewsItem {
  id: string;
  title: string;
  examCategory: ExamCategory | 'GENERAL';
  date: string;
  author: string;
  summary: string;
  fullContent: string;
  source: string;
  tag: string;
  isImportant?: boolean;
  readTime: string;
}
