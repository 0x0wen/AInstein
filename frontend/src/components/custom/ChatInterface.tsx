import { useState, useRef, useEffect } from 'react';
import {
  SendHorizontal,
  Plus,
  Video,
  BookOpen,
  BrainCircuit,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoPlayer } from './VideoPlayer';
import { QuizComponent } from './QuizComponent';
import { FlashcardComponent } from './FlashCardComponent';
import { StudyKit } from '@/dummy';

interface ChatInterfaceProps {
  studyKit: StudyKit;
  conversationId: string;
}

type MessageType =
  | { type: 'text'; content: string; sender: 'user' | 'assistant' }
  | {
      type: 'video';
      content: { id: string; title: string; duration: string };
      sender: 'assistant';
    }
  | {
      type: 'quiz';
      content: { id: string; title: string; questions: number };
      sender: 'assistant';
    }
  | {
      type: 'flashcards';
      content: { id: string; title: string; cards: number };
      sender: 'assistant';
    }
  | {
      type: 'progress';
      content: {
        overall: number;
        topics: { name: string; progress: number }[];
      };
      sender: 'assistant';
    };

export function ChatInterface({
  studyKit,
  conversationId,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>([  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeContent, setActiveContent] = useState<{
    type: string;
    id: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: 'text', content: inputValue, sender: 'user' },
    ]);

    // Simulate AI response based on user input
    setTimeout(() => {
      let response: MessageType;

      if (inputValue.toLowerCase().includes('derivative')) {
        response = {
          type: 'text',
          content:
            "Derivatives measure the rate of change of a function with respect to a variable. The derivative of a function f(x) is denoted as f'(x) or df/dx. Would you like to see a video explaining derivatives in more detail?",
          sender: 'assistant',
        };
      } else if (
        inputValue.toLowerCase().includes('video') &&
        inputValue.toLowerCase().includes('integration')
      ) {
        response = {
          type: 'video',
          content: {
            id: 'integration-techniques',
            title: 'Integration Techniques',
            duration: '7:45',
          },
          sender: 'assistant',
        };
        setActiveContent({ type: 'video', id: 'integration-techniques' });
      } else if (
        inputValue.toLowerCase().includes('quiz') &&
        inputValue.toLowerCase().includes('limit')
      ) {
        response = {
          type: 'quiz',
          content: {
            id: 'limits-quiz',
            title: 'Limits Quiz',
            questions: 5,
          },
          sender: 'assistant',
        };
        setActiveContent({ type: 'quiz', id: 'limits-quiz' });
      } else if (
        inputValue.toLowerCase().includes('flashcard') ||
        inputValue.toLowerCase().includes('flash card')
      ) {
        response = {
          type: 'flashcards',
          content: {
            id: 'derivatives-flashcards',
            title: 'Derivatives Flashcards',
            cards: 12,
          },
          sender: 'assistant',
        };
        setActiveContent({ type: 'flashcards', id: 'derivatives-flashcards' });
      } else if (inputValue.toLowerCase().includes('progress')) {
        response = {
          type: 'progress',
          content: {
            overall: 65,
            topics: [
              { name: 'Derivatives', progress: 75 },
              { name: 'Limits', progress: 45 },
              { name: 'Integration', progress: 30 },
            ],
          },
          sender: 'assistant',
        };
      } else {
        response = {
          type: 'text',
          content:
            'I can help you with calculus concepts like derivatives, limits, and integration. You can ask me to explain concepts, show videos, create quizzes, or generate flashcards to help you study.',
          sender: 'assistant',
        };
      }

      setMessages((prev) => [...prev, response]);
    }, 1000);

    setInputValue('');
  };

  const renderMessage = (message: MessageType, index: number) => {
    switch (message.type) {
      case 'text':
        return (
          <div
            className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground ml-12' : 'bg-muted text-foreground mr-12'}`}
          >
            {message.content}
          </div>
        );
      case 'video':
        return (
          <div className="bg-muted p-4 rounded-lg mr-12">
            <div className="flex items-start gap-3">
              <Video className="mt-1" size={20} />
              <div>
                <p>Here's a video about {message.content.title}:</p>
                <div className="mt-2 bg-card rounded-lg overflow-hidden border">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">{message.content.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {message.content.duration}
                    </span>
                  </div>
                  <div className="aspect-video bg-black/10 flex items-center justify-center">
                    <Button
                      onClick={() =>
                        setActiveContent({
                          type: 'video',
                          id: message.content.id,
                        })
                      }
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="bg-muted p-4 rounded-lg mr-12">
            <div className="flex items-start gap-3">
              <BrainCircuit className="mt-1" size={20} />
              <div>
                <p>
                  I've prepared a quiz on {message.content.title.toLowerCase()}{' '}
                  for you:
                </p>
                <div className="mt-2 bg-card rounded-lg overflow-hidden border">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">{message.content.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {message.content.questions} questions
                    </p>
                  </div>
                  <div className="p-4 flex justify-center">
                    <Button
                      onClick={() =>
                        setActiveContent({
                          type: 'quiz',
                          id: message.content.id,
                        })
                      }
                    >
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'flashcards':
        return (
          <div className="bg-muted p-4 rounded-lg mr-12">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1" size={20} />
              <div>
                <p>
                  Here are some flashcards to help you study{' '}
                  {message.content.title.toLowerCase()}:
                </p>
                <div className="mt-2 bg-card rounded-lg overflow-hidden border">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">{message.content.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {message.content.cards} cards
                    </p>
                  </div>
                  <div className="p-4 flex justify-center">
                    <Button
                      onClick={() =>
                        setActiveContent({
                          type: 'flashcards',
                          id: message.content.id,
                        })
                      }
                    >
                      Study Flashcards
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="bg-muted p-4 rounded-lg mr-12">
            <div className="flex items-start gap-3">
              <BarChart3 className="mt-1" size={20} />
              <div>
                <p>Here's your current progress in Calculus Fundamentals:</p>
                <div className="mt-2 bg-card rounded-lg overflow-hidden border p-4">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Overall Progress
                      </span>
                      <span className="text-sm font-medium">
                        {message.content.overall}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${message.content.overall}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {message.content.topics.map((topic, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{topic.name}</span>
                          <span className="text-sm">{topic.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/70"
                            style={{ width: `${topic.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      <div
        className={`flex-1 flex flex-col h-full  ${activeContent ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="flex-1 overflow-y-auto p-4 my-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold text-foreground mb-2">Welcome to {studyKit.name}</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Ask me anything about {studyKit.name.toLowerCase()}, request videos, quizzes, or flashcards to help you learn.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {renderMessage(message, index)}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Plus size={20} />
            </Button>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Ask a question or request a learning resource..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="flex-1 text-foreground"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="shrink-0"
              >
                <SendHorizontal size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {activeContent && (
        <div
          className={`${activeContent ? 'flex-1 md:w-1/2 border-l' : 'hidden'} flex flex-col h-full`}
        >
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">
              {activeContent.type === 'video' && 'Integration Techniques'}
              {activeContent.type === 'quiz' && 'Limits Quiz'}
              {activeContent.type === 'flashcards' && 'Derivatives Flashcards'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveContent(null)}
            >
              Close
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {activeContent.type === 'video' && (
              <VideoPlayer videoId={activeContent.id} />
            )}
            {activeContent.type === 'quiz' && (
              <QuizComponent quizId={activeContent.id} />
            )}
            {activeContent.type === 'flashcards' && (
              <FlashcardComponent deckId={activeContent.id} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
