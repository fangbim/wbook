import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiPlay, FiShuffle, FiCheck, FiX } from "react-icons/fi";
import { HiOutlinePlusSm } from "react-icons/hi";
import { PiCardsBold } from "react-icons/pi";

// Mock Flashcard type for demonstration
interface Flashcard {
  id?: string;
  front: string;
  back: string;
  difficulty?: "easy" | "medium" | "hard";
  lastReviewed?: Date;
  correctCount?: number;
  incorrectCount?: number;
}

interface FlashcardProps {
  flashcards: Flashcard[];
  currentPage: number;
  limit: number;
  setFlascardModalOpened: (open: boolean) => void;
  handleDeleteFlashcard: (flashcardId: string) => void;
}

export default function FlashCard({
  flashcards,
  currentPage,
  limit,
  setFlascardModalOpened = () => {},
  handleDeleteFlashcard = () => {},
}: FlashcardProps) {
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyStats, setStudyStats] = useState({ correct: 0, incorrect: 0 });
  const [completedCards, setCompletedCards] = useState(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const shuffleCards = () => {
    // In real implementation, you'd shuffle the flashcards array
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const startStudyMode = () => {
    setStudyMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyStats({ correct: 0, incorrect: 0 });
    setCompletedCards(new Set());
  };

  const exitStudyMode = () => {
    setStudyMode(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    const newStats = {
      correct: correct ? studyStats.correct + 1 : studyStats.correct,
      incorrect: correct ? studyStats.incorrect : studyStats.incorrect + 1,
    };
    setStudyStats(newStats);

    const newCompleted = new Set(completedCards);
    newCompleted.add(currentCardIndex);
    setCompletedCards(newCompleted);

    // Move to next card
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Study session complete
      setTimeout(() => {
        toast(
          <div>
            <strong>Study session complete!</strong>
            <div>✅ Correct: {newStats.correct}</div>
            <div>❌ Incorrect: {newStats.incorrect}</div>
          </div>,
        );

        exitStudyMode();
      }, 500);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    if (total === 0) return "bg-gray-200";
    const percentage = (correct / total) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (studyMode && flashcards.length > 0) {
    const currentCard = flashcards[currentCardIndex];
    const progress =
      ((currentCardIndex + (completedCards.has(currentCardIndex) ? 1 : 0)) /
        flashcards.length) *
      100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Study Mode Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={exitStudyMode}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Exit Study
              </button>
              <div className="text-lg font-semibold text-gray-800">
                Card {currentCardIndex + 1} of {flashcards.length}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                ✅ {studyStats.correct} | ❌ {studyStats.incorrect}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Study Card */}
          <div className="relative w-full h-80 mb-8">
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={handleCardFlip}
            >
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 h-full flex flex-col justify-center items-center text-center">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Question
                    </span>
                  </div>
                  <p className="text-xl text-gray-800 leading-relaxed">
                    {currentCard.front}
                  </p>
                  <div className="mt-6 text-sm text-gray-500">
                    Click to reveal answer
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl border border-green-200 p-8 h-full flex flex-col justify-center items-center text-center">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Answer
                    </span>
                  </div>
                  <p className="text-lg text-gray-800 leading-relaxed mb-6">
                    {currentCard.back}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Buttons */}
          {isFlipped && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                <FiX className="w-5 h-5" />
                Incorrect
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
              >
                <FiCheck className="w-5 h-5" />
                Correct
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#03C988] rounded-lg">
            <PiCardsBold className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Study Flashcards
            </h3>
            <p className="text-sm text-gray-600">
              {flashcards.length} cards available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {flashcards.length > 0 && (
            <>
              <button
                onClick={shuffleCards}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <FiShuffle className="w-4 h-4" />
                Shuffle
              </button>
              <button
                onClick={startStudyMode}
                className="flex items-center gap-2 px-4 py-2 bg-[#1C82AD] text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FiPlay className="w-4 h-4" />
                Study Mode
              </button>
            </>
          )}
          <button
            onClick={() => setFlascardModalOpened(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#03C988] hover:bg-green-600 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <HiOutlinePlusSm className="w-4 h-4" />
            Add Flashcard
          </button>
        </div>
      </div>

      {flashcards.length > 0 ? (
        <>
          {/* View Toggle */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow"
                      : "text-gray-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow"
                      : "text-gray-600"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Flashcards Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "space-y-4"
            }
          >
            {flashcards.map((card, index) => {
              const total =
                (card.correctCount || 0) + (card.incorrectCount || 0);
              const accuracy =
                total > 0 ? ((card.correctCount || 0) / total) * 100 : 0;

              return (
                <div
                  key={card.id}
                  className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#03C988] rounded-lg flex items-center justify-center text-white font-medium text-sm">
                          {(currentPage - 1) * limit + index + 1}
                        </div>
                        {card.difficulty && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                              card.difficulty
                            )}`}
                          >
                            {card.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {total > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <div
                              className={`w-2 h-2 rounded-full ${getProgressColor(
                                card.correctCount || 0,
                                card.incorrectCount || 0
                              )}`}
                            ></div>
                            {accuracy.toFixed(0)}%
                          </div>
                        )}
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete flashcard"
                          onClick={() =>
                            card.id && handleDeleteFlashcard(card.id)
                          }
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-[#1C82AD] rounded-full"></div>
                        <span className="text-xs font-semibold text-[#1C82AD] uppercase tracking-wide">
                          Question
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {card.front}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-[#03C988] rounded-full"></div>
                        <span className="text-xs font-semibold text-[#03C988] uppercase tracking-wide">
                          Answer
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {card.back}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {total > 0 && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>
                          {card.correctCount || 0}/{total} correct
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(
                            card.correctCount || 0,
                            card.incorrectCount || 0
                          )}`}
                          style={{ width: `${accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center border-2 border-dashed border-gray-300 rounded-2xl p-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#03C988] rounded-2xl flex items-center justify-center">
              <PiCardsBold className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              No Flashcards Yet
            </h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Create your first flashcard to start learning! Click the &quot;Add
              Flashcard&quot; button to get started with your study journey.
            </p>
            <button
              onClick={() => setFlascardModalOpened(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <HiOutlinePlusSm className="w-5 h-5" />
              Create Your First Flashcard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
