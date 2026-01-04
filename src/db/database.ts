import Dexie, { type EntityTable } from 'dexie';
import type { Character, CharacterProgress, ReviewLog } from '../types';

const db = new Dexie('ChineseFlashcardsDB') as Dexie & {
  characters: EntityTable<Character, 'id'>;
  progress: EntityTable<CharacterProgress, 'characterId'>;
  reviewLog: EntityTable<ReviewLog, 'id'>;
};

db.version(1).stores({
  characters: 'id, hskLevel',
  progress: 'characterId, nextReviewDate, status',
  reviewLog: '++id, characterId, reviewedAt',
});

db.version(2).stores({
  characters: 'id, hskLevel',
  progress: 'characterId, nextReviewDate, status, createdAt',
  reviewLog: '++id, characterId, reviewedAt',
});

export { db };
