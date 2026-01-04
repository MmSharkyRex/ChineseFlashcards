import type { Character } from '../types';

interface QuizCardProps {
  character: Character;
  options: string[];
  onAnswer: (answer: string) => void;
  showResult: boolean;
  selectedAnswer?: string;
  correctAnswer: string;
}

export function QuizCard({
  character,
  options,
  onAnswer,
  showResult,
  selectedAnswer,
  correctAnswer,
}: QuizCardProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="text-center mb-8">
          <div className="text-8xl font-bold mb-4">{character.hanzi}</div>
          <div className="text-2xl text-gray-600">{character.pinyin}</div>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = showResult && selectedAnswer === option;
            const isCorrect = showResult && option === correctAnswer;
            const isWrong = isSelected && option !== correctAnswer;

            let buttonClass =
              'w-full p-4 text-lg rounded-xl border-2 transition-all ';

            if (isCorrect) {
              buttonClass += 'bg-green-100 border-green-500 text-green-800';
            } else if (isWrong) {
              buttonClass += 'bg-red-100 border-red-500 text-red-800';
            } else if (showResult) {
              buttonClass += 'bg-gray-50 border-gray-200 text-gray-400';
            } else {
              buttonClass +=
                'bg-white border-gray-300 text-gray-800 hover:bg-blue-50 hover:border-blue-400 active:scale-95';
            }

            return (
              <button
                key={index}
                onClick={() => !showResult && onAnswer(option)}
                disabled={showResult}
                className={buttonClass}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div
          className={`text-center p-6 rounded-xl ${
            selectedAnswer === correctAnswer
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="text-3xl font-bold mb-2">
            {selectedAnswer === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          {selectedAnswer !== correctAnswer && (
            <div className="text-lg">
              The correct answer is: <strong>{correctAnswer}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
