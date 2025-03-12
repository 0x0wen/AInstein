import { BookOpen, MessageSquare, Video, FileQuestion } from 'lucide-react';

export function GettingStartedGuide() {
  const steps = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Create a Study Kit',
      description:
        'Start by creating a Study Kit for your subject or topic of interest',
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'Chat with AInstein',
      description:
        'Ask questions and get personalized explanations from your AI tutor',
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: 'Generate Explanatory Videos',
      description:
        'Upload problems and get video explanations to understand concepts better',
    },
    {
      icon: <FileQuestion className="h-8 w-8" />,
      title: 'Test Your Knowledge',
      description: 'Create flashcards and quizzes to reinforce your learning',
    },
  ];

  return (
    <section className="my-16">
      <h2 className="text-2xl font-bold text-center mb-12 text-foreground">
        Getting Started with AInstein
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-foreground">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              {step.icon}
            </div>
            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>

            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute transform translate-x-[9rem] translate-y-8">
                <svg
                  width="64"
                  height="24"
                  viewBox="0 0 64 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M63.0607 13.0607C63.6464 12.4749 63.6464 11.5251 63.0607 10.9393L53.5147 1.3934C52.9289 0.807611 51.9792 0.807611 51.3934 1.3934C50.8076 1.97919 50.8076 2.92893 51.3934 3.51472L59.8787 12L51.3934 20.4853C50.8076 21.0711 50.8076 22.0208 51.3934 22.6066C51.9792 23.1924 52.9289 23.1924 53.5147 22.6066L63.0607 13.0607ZM0 13.5H62V10.5H0V13.5Z"
                    fill="#D1D5DB"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
