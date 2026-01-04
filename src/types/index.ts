export interface Character {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  hskLevel: 1 | 2 | 3 | 4;
}

export interface CharacterProgress {
  characterId: string;
  reviewCount: number;
  correctCount: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
  easeFactor: number;
  interval: number;
  status: 'new' | 'learning' | 'mastered';
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewLog {
  id?: number;
  characterId: string;
  reviewedAt: Date;
  correct: boolean;
}

export interface QuizQuestion {
  character: Character;
  options: string[];
  correctAnswer: string;
}

export interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  answers: boolean[];
}
