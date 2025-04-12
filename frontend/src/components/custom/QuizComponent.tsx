import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface QuizComponentProps {
  quizId: string;
}

export function QuizComponent({ quizId }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sample quiz data - in a real app, this would be fetched based on quizId
  const quiz = {
    title: 'Limits Quiz',
    description: 'Test your knowledge of limits in calculus',
    questions: [
      {
        id: 1,
        text: 'What is the limit of (sin x)/x as x approaches 0?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: '∞' },
          { id: 'd', text: 'Undefined' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 2,
        text: 'What is the limit of (1 - cos x)/x as x approaches 0?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: '∞' },
          { id: 'd', text: 'Undefined' },
        ],
        correctAnswer: 'a',
      },
      {
        id: 3,
        text: 'If lim(x→a) f(x) = L and lim(x→a) g(x) = M, then lim(x→a) [f(x) + g(x)] = ?',
        options: [
          { id: 'a', text: 'L + M' },
          { id: 'b', text: 'L - M' },
          { id: 'c', text: 'L × M' },
          { id: 'd', text: 'L / M' },
        ],
        correctAnswer: 'a',
      },
      {
        id: 4,
        text: 'What is the limit of x² as x approaches infinity?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: '∞' },
          { id: 'd', text: 'Undefined' },
        ],
        correctAnswer: 'c',
      },
      {
        id: 5,
        text: 'What is the limit of 1/x as x approaches 0 from the right?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: '∞' },
          { id: 'd', text: 'Undefined' },
        ],
        correctAnswer: 'c',
      },
    ],
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    return {
      score: correctCount,
      total: quiz.questions.length,
      percentage: Math.round((correctCount / quiz.questions.length) * 100),
    };
  };

  if (quizCompleted) {
    const result = calculateScore();
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
            <CardDescription>
              Here's how you did on the {quiz.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">
                {result.percentage}%
              </div>
              <p className="text-muted-foreground">
                You got {result.score} out of {result.total} questions correct
              </p>
            </div>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const isCorrect =
                  selectedAnswers[index] === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                  >
                    <p className="font-medium mb-1">Question {index + 1}</p>
                    <p className="text-sm mb-2">{question.text}</p>
                    <div className="flex justify-between text-sm">
                      <span>
                        Your answer:{' '}
                        {question.options.find(
                          (o) => o.id === selectedAnswers[index],
                        )?.text || 'Not answered'}
                      </span>
                      {!isCorrect && (
                        <span className="font-medium">
                          Correct:{' '}
                          {
                            question.options.find(
                              (o) => o.id === question.correctAnswer,
                            )?.text
                          }
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setQuizCompleted(false);
              }}
              className="w-full"
            >
              Retake Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h3>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%
            Complete
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestionData.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ''}
            onValueChange={(value) => {
              setSelectedAnswers({
                ...selectedAnswers,
                [currentQuestion]: value,
              });
            }}
            className="space-y-3"
          >
            {currentQuestionData.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion]}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
