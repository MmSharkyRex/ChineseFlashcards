import { db } from './database';
import hskCharacters from '../data/hsk-characters.json';
import type { Character } from '../types';

export async function seedDatabase() {
  const count = await db.characters.count();
  const expectedCount = hskCharacters.characters.length;

  // Re-seed if character count doesn't match (data was updated)
  if (count !== expectedCount) {
    console.log(`Database has ${count} characters, expected ${expectedCount}. Re-seeding...`);
    await db.characters.clear();
    await db.characters.bulkAdd(hskCharacters.characters as Character[]);
    console.log(`Seeded ${hskCharacters.characters.length} characters`);
  } else if (count === 0) {
    await db.characters.bulkAdd(hskCharacters.characters as Character[]);
    console.log(`Seeded ${hskCharacters.characters.length} characters`);
  } else {
    console.log(`Database already has ${count} characters, skipping seed.`);
  }
}

export async function resetDatabase() {
  console.log('Resetting database...');
  await db.characters.clear();
  await db.progress.clear();
  await db.reviewLog.clear();
  await seedDatabase();
  console.log('Database reset complete!');
}
