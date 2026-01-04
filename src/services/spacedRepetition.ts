import { addDays } from 'date-fns';
import type { CharacterProgress } from '../types';

export function calculateNextReview(
  progress: CharacterProgress,
  correct: boolean
): Partial<CharacterProgress> {
  const now = new Date();
  let newInterval: number;
  let newEaseFactor = progress.easeFactor;

  if (correct) {
    newEaseFactor = Math.min(progress.easeFactor + 0.1, 3.0);

    if (progress.reviewCount === 0) {
      newInterval = 1;
    } else if (progress.reviewCount === 1) {
      newInterval = 2;
    } else {
      newInterval = Math.round(progress.interval * newEaseFactor);
    }
  } else {
    newEaseFactor = Math.max(progress.easeFactor - 0.2, 1.3);
    newInterval = 1;
  }

  if (progress.reviewCount < 7) {
    newInterval = Math.min(newInterval, 30);
  }

  const nextReviewDate = addDays(now, newInterval);
  const newReviewCount = progress.reviewCount + 1;

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextReviewDate,
    reviewCount: newReviewCount,
    correctCount: correct ? progress.correctCount + 1 : progress.correctCount,
    lastReviewDate: now,
    status: newReviewCount >= 7 ? 'mastered' : 'learning',
    updatedAt: now,
  };
}

export function initializeProgress(characterId: string): CharacterProgress {
  const now = new Date();
  return {
    characterId,
    reviewCount: 0,
    correctCount: 0,
    lastReviewDate: now,
    nextReviewDate: now,
    easeFactor: 2.5,
    interval: 0,
    status: 'new',
    createdAt: now,
    updatedAt: now,
  };
}
