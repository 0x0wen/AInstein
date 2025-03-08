import { createFileRoute } from '@tanstack/react-router';
import { Button } from "@/components/ui/button"
import { StudyKitCard } from '../components/custom/study-kit-card'
import { HeroSection } from "../components/custom/hero-section"
import { GettingStartedGuide } from "../components/custom/getting-started-guide"
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomePage,
});

export default function HomePage() {
  // Sample study kits data
  const studyKits = [
    {
      id: "1",
      name: "Calculus Fundamentals",
      description: "Learn the basics of calculus including limits, derivatives, and integrals",
      subject: "Mathematics",
      progress: 65,
      lastAccessed: "2023-11-15T14:30:00Z",
      color: "#1E88E5",
    },
    {
      id: "2",
      name: "Organic Chemistry",
      description: "Study organic compounds, reactions, and laboratory techniques",
      subject: "Chemistry",
      progress: 32,
      lastAccessed: "2023-11-14T09:15:00Z",
      color: "#7CB342",
    },
    {
      id: "3",
      name: "World History",
      description: "Explore major historical events and their impact on modern society",
      subject: "History",
      progress: 78,
      lastAccessed: "2023-11-16T16:45:00Z",
      color: "#FFA000",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <HeroSection />

      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Study Kits</h2>
          <Button>Create New Kit</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyKits.map((kit) => (
            <StudyKitCard key={kit.id} studyKit={kit} />
          ))}

          <Link to="/study-kit/create" className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 h-full flex flex-col items-center justify-center text-center hover:border-primary hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
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
              <h3 className="text-lg font-medium mb-2">Create New Study Kit</h3>
              <p className="text-muted-foreground">Start a new learning journey with a fresh Study Kit</p>
            </div>
          </Link>
        </div>
      </section>

      <GettingStartedGuide />
    </main>
  )
}


