import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface FlashcardComponentProps {
  deckId: string;
}

export function FlashcardComponent({ deckId }: FlashcardComponentProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Record<number, boolean>>({});

  // Sample flashcard data - in a real app, this would be fetched based on deckId
  const flashcards = [
    {
      id: 1,
      front: 'What is a derivative?',
      back: 'A derivative measures the rate at which a function is changing at a given point. It is the slope of the tangent line to the function at that point.',
    },
    {
      id: 2,
      front: 'What is the derivative of f(x) = x²?',
      back: "f'(x) = 2x",
    },
    {
      id: 3,
      front: 'What is the derivative of f(x) = sin(x)?',
      back: "f'(x) = cos(x)",
    },
    {
      id: 4,
      front: 'What is the derivative of f(x) = e^x?',
      back: "f'(x) = e^x",
    },
    {
      id: 5,
      front: 'What is the derivative of f(x) = ln(x)?',
      back: "f'(x) = 1/x",
    },
    {
      id: 6,
      front: 'What is the chain rule?',
      back: "The chain rule is a formula for computing the derivative of a composite function. If f(x) = g(h(x)), then f'(x) = g'(h(x)) · h'(x).",
    },
    {
      id: 7,
      front: 'What is the product rule?',
      back: "The product rule states that if f(x) = g(x) · h(x), then f'(x) = g'(x) · h(x) + g(x) · h'(x).",
    },
    {
      id: 8,
      front: 'What is the quotient rule?',
      back: "The quotient rule states that if f(x) = g(x)/h(x), then f'(x) = [g'(x) · h(x) - g(x) · h'(x)]/[h(x)]².",
    },
    {
      id: 9,
      front: 'What is the power rule?',
      back: "The power rule states that if f(x) = x^n, then f'(x) = n · x^(n-1).",
    },
    {
      id: 10,
      front: 'What is the derivative of a constant?',
      back: 'The derivative of a constant is 0.',
    },
    {
      id: 11,
      front: 'What is the second derivative?',
      back: 'The second derivative is the derivative of the derivative of a function. It measures how the rate of change of a function is itself changing.',
    },
    {
      id: 12,
      front: "What does f''(x) > 0 tell us about the graph of f(x)?",
      back: "If f''(x) > 0, the graph of f(x) is concave up (shaped like a cup) at that point.",
    },
  ];

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsKnown = () => {
    setKnownCards({
      ...knownCards,
      [currentCardIndex]: true,
    });
    handleNextCard();
  };

  const markAsUnknown = () => {
    setKnownCards({
      ...knownCards,
      [currentCardIndex]: false,
    });
    handleNextCard();
  };

  const resetDeck = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards({});
  };

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
  const knownCount = Object.values(knownCards).filter(Boolean).length;

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">
            Card {currentCardIndex + 1} of {flashcards.length}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
            <Button variant="ghost" size="icon" onClick={resetDeck}>
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 flex items-center justify-center cursor-pointer"
          onClick={toggleFlip}
        >
          <div
            className={`w-full max-w-md h-64 relative transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            <Card
              className={`absolute inset-0 p-6 flex items-center justify-center backface-hidden ${isFlipped ? 'hidden' : ''}`}
            >
              <div className="text-center">
                <div className="text-xl font-medium mb-2">
                  {currentCard.front}
                </div>
                <p className="text-sm text-muted-foreground">Click to flip</p>
              </div>
            </Card>
            <Card
              className={`absolute inset-0 p-6 flex items-center justify-center backface-hidden ${isFlipped ? '' : 'hidden'}`}
            >
              <div className="text-center">
                <div className="text-lg mb-2">{currentCard.back}</div>
                <p className="text-sm text-muted-foreground">
                  Click to flip back
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
          >
            <ChevronLeft size={20} />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`px-6 ${knownCards[currentCardIndex] === false ? 'bg-red-100' : ''}`}
              onClick={markAsUnknown}
            >
              Don't Know
            </Button>
            <Button
              className={`px-6 ${knownCards[currentCardIndex] === true ? 'bg-green-600' : ''}`}
              onClick={markAsKnown}
            >
              Know It
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextCard}
            disabled={currentCardIndex === flashcards.length - 1}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <span>
            Mastery: {Math.round((knownCount / flashcards.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
