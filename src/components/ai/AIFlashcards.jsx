import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

/**
 * AI Flashcards Component
 * Interactive flashcard viewer for study materials
 */
const AIFlashcards = ({ flashcards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [cards, setCards] = useState(flashcards);

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card className="text-center p-8">
        <p className="text-muted-gray">No flashcards available</p>
      </Card>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(true);
  };

  const handleReset = () => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(false);
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-gray">
        <span>
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Shuffle size={16} />}
            onClick={handleShuffle}
          >
            Shuffle
          </Button>
          {shuffled && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw size={16} />}
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative h-64 md:h-80 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <Card
              className="absolute inset-0 flex items-center justify-center p-8 backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
            >
              <div className="text-center">
                <p className="text-xs text-muted-gray mb-4">Question</p>
                <p className="text-lg md:text-xl font-medium text-primary-black">
                  {currentCard.front}
                </p>
                <p className="text-xs text-muted-gray mt-6">Click to flip</p>
              </div>
            </Card>

            {/* Back */}
            <Card
              className="absolute inset-0 flex items-center justify-center p-8 backface-hidden bg-vibrant-orange text-white"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="text-center">
                <p className="text-xs opacity-80 mb-4">Answer</p>
                <p className="text-lg md:text-xl font-medium">
                  {currentCard.back}
                </p>
                <p className="text-xs opacity-80 mt-6">Click to flip back</p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft size={18} />}
          onClick={handlePrevious}
          disabled={cards.length <= 1}
        >
          Previous
        </Button>
        <div className="flex space-x-1">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsFlipped(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-vibrant-orange'
                  : 'bg-muted-gray bg-opacity-30'
              }`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          rightIcon={<ChevronRight size={18} />}
          onClick={handleNext}
          disabled={cards.length <= 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AIFlashcards;
