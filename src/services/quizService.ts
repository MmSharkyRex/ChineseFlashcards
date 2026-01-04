import { db } from '../db/database';
import type { Character, QuizQuestion, ReviewLog } from '../types';
import { initializeProgress, calculateNextReview } from './spacedRepetition';

export async function getDueCharacters(limit: number = 10): Promise<Character[]> {
  const now = new Date();

  const dueProgress = await db.progress
    .where('nextReviewDate')
    .belowOrEqual(now)
    .limit(limit)
    .toArray();

  const dueCharacterIds = dueProgress.map((p) => p.characterId);
  const dueCharacters = await db.characters
    .where('id')
    .anyOf(dueCharacterIds)
    .toArray();

  if (dueCharacters.length < limit) {
    const newCount = limit - dueCharacters.length;
    const existingIds = await db.progress.toCollection().primaryKeys();

    const newCharacters = await db.characters
      .filter((char) => !existingIds.includes(char.id))
      .limit(newCount)
      .toArray();

    for (const char of newCharacters) {
      const progress = initializeProgress(char.id);
      await db.progress.add(progress);
    }

    return [...dueCharacters, ...newCharacters];
  }

  return dueCharacters;
}

export function generateQuestion(
  targetCharacter: Character,
  allCharacters: Character[]
): QuizQuestion {
  const wrongAnswers = allCharacters
    .filter(
      (c) =>
        c.id !== targetCharacter.id &&
        c.hskLevel === targetCharacter.hskLevel &&
        c.english !== targetCharacter.english
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((c) => c.english);

  while (wrongAnswers.length < 3) {
    const randomChar = allCharacters[
      Math.floor(Math.random() * allCharacters.length)
    ];
    if (
      randomChar.id !== targetCharacter.id &&
      !wrongAnswers.includes(randomChar.english) &&
      randomChar.english !== targetCharacter.english
    ) {
      wrongAnswers.push(randomChar.english);
    }
  }

  const options = [...wrongAnswers, targetCharacter.english].sort(
    () => Math.random() - 0.5
  );

  return {
    character: targetCharacter,
    options,
    correctAnswer: targetCharacter.english,
  };
}

export async function submitAnswer(
  characterId: string,
  correct: boolean
): Promise<void> {
  const progress = await db.progress.get(characterId);

  if (!progress) {
    console.error(`Progress not found for character ${characterId}`);
    return;
  }

  const updates = calculateNextReview(progress, correct);
  await db.progress.update(characterId, updates);

  const log: ReviewLog = {
    characterId,
    reviewedAt: new Date(),
    correct,
  };
  await db.reviewLog.add(log);
}

export async function getStats() {
  const totalCharacters = await db.characters.count();
  const totalProgress = await db.progress.count();
  const mastered = await db.progress.where('status').equals('mastered').count();
  const learning = await db.progress.where('status').equals('learning').count();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  // Count characters due for review today (not new, but scheduled for today)
  const dueReviews = await db.progress
    .where('nextReviewDate')
    .belowOrEqual(now)
    .filter(p => p.reviewCount > 0) // Only count reviews, not new characters
    .count();

  // Count NEW characters started today (createdAt is today)
  const newStartedToday = await db.progress
    .where('createdAt')
    .between(todayStart, tomorrowStart, true, false)
    .count();

  const unstartedCount = totalCharacters - totalProgress;

  // Calculate remaining new characters available today
  const dailyNewCharLimit = 20;
  const remainingNewChars = Math.max(0, dailyNewCharLimit - newStartedToday);
  const newCharsAvailable = Math.min(unstartedCount, remainingNewChars);

  const dueToday = dueReviews + newCharsAvailable;

  const allProgress = await db.progress.toArray();
  const totalReviews = allProgress.reduce((sum, p) => sum + p.reviewCount, 0);
  const totalCorrect = allProgress.reduce((sum, p) => sum + p.correctCount, 0);
  const accuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

  return {
    totalCharacters,
    started: totalProgress,
    mastered,
    learning,
    dueToday,
    accuracy: Math.round(accuracy),
  };
}
