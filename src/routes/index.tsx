import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { StudyKitCard } from '../components/custom/study-kit-card';
import { HeroSection } from '../components/custom/hero-section';
import { GettingStartedGuide } from '../components/custom/getting-started-guide';
import { Link } from '@tanstack/react-router';
import { data } from '@/dummy';
export const Route = createFileRoute('/')({
  component: HomePage,
});

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeroSection />
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Your Study Kits
          </h2>
          <Button>Create New Kit</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.studyKits.map((kit) => (
            <StudyKitCard key={kit.id} studyKit={kit} />
          ))}

          <Link to="/study-kit/create" className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 h-full flex flex-col items-center justify-center text-center hover:border-primary hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xlinkTitle=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">
                Create New Study Kit
              </h3>
              <p className="text-muted-foreground">
                Start a new learning journey with a fresh Study Kit
              </p>
            </div>
          </Link>
        </div>
      </section>

      <GettingStartedGuide />
    </main>
  );
}
