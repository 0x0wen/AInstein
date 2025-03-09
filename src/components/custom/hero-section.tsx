import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
export function HeroSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Meet <span className="text-primary">AInstein</span>, your personal
            AI tutor
          </h1>
          <p className="text-xl text-gray-600">
            Organize your learning journey with Study Kits and access powerful
            AI tools to master any subject.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/study-kit/create">Create Your First Study Kit</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="AInstein platform demonstration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  your learning with Study Kits!" "Hello! I'm AInstein, your AI
                  tutor. Let me help you organize
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
