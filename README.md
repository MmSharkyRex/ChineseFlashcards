# Chinese Flashcards

A web-based Chinese character learning app using spaced repetition to help master HSK 1-4 vocabulary.

## Features

- **1,196 Chinese Characters**: Complete HSK 1-4 vocabulary with pinyin and English translations
- **Spaced Repetition Algorithm**: Each character reviewed 7 times over 30 days for optimal retention
- **Daily Learning Quota**: 20 new characters per day to make learning manageable
- **Multiple Choice Quiz**: Test your knowledge with 4-choice questions
- **Progress Tracking**: Monitor your learning with status filters (New, Learning, Mastered)
- **Offline-First**: All data stored locally using IndexedDB
- **Clean UI**: Minimal, kid-friendly design with immediate feedback

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Database**: Dexie.js (IndexedDB wrapper)
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js 20+ (or latest LTS version)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:nicholasding/ChineseFlashcards.git
cd ChineseFlashcards

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## How It Works

### Spaced Repetition Schedule

The app uses a modified SM-2 algorithm to schedule reviews:

1. **First review**: 1 day later
2. **Second review**: 2 days later
3. **Subsequent reviews**: Interval multiplied by ease factor (2.5 default)
4. **Maximum interval**: 30 days (until mastered)

**Correct answers**: Increase ease factor (+0.1, max 3.0)
**Incorrect answers**: Reset to 1-day interval, decrease ease factor (-0.2, min 1.3)

### Daily Workflow

1. **Start with 20 new characters** each day
2. **Answer questions** with immediate feedback
3. **Characters scheduled automatically** based on performance
4. **Track progress** on the Progress page
5. **Complete your daily quota** - "Due Today" shows 0 when done

### Character Status

- **New**: Added to queue, not yet reviewed (reviewCount = 0)
- **Learning**: Actively being learned (1-6 reviews)
- **Mastered**: Completed 7 reviews successfully

## Project Structure

```
src/
├── components/      # React components
│   └── QuizCard.tsx
├── data/           # HSK vocabulary data
│   └── hsk-characters.json
├── db/             # Database setup and seeding
│   ├── database.ts
│   └── seed.ts
├── hooks/          # Custom React hooks
│   └── useQuiz.ts
├── pages/          # Page components
│   ├── HomePage.tsx
│   ├── QuizPage.tsx
│   └── ProgressPage.tsx
├── services/       # Business logic
│   ├── quizService.ts
│   └── spacedRepetition.ts
└── types/          # TypeScript type definitions
    └── index.ts
```

## Data Source

HSK vocabulary sourced from:
- [plaktos/hsk_csv](https://github.com/plaktos/hsk_csv)
- [Mandarin Bean HSK Lists](https://mandarinbean.com/hsk-vocabulary-list/)

## License

MIT

## Acknowledgments

Built with [Claude Code](https://claude.com/claude-code)
