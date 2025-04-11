import { createFileRoute } from '@tanstack/react-router';
import { StudyKitCard } from '../components/custom/study-kit-card';
import { Link } from '@tanstack/react-router';
import { data as dummy, type StudyKit } from '@/dummy';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export const Route = createFileRoute('/')({
  component: HomePage,
});

export default function HomePage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  const { data } = useQuery({
    queryKey: ['Studykit List'],
    queryFn: async () => {
      return await api.get('/studykit').then((res) => {
        console.log(res.data);
        return res.data;
      });
    },
  });
  return (
    <main className="container mx-auto px-4 py-8">
      {/* <HeroSection /> */}
      <section className="">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Your Study Kits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {dummy.studyKits.map((kit) => (
            <StudyKitCard key={kit._id} studyKit={kit} />
          ))}
          {/* {data?.map((kit: StudyKit) => ( */}
          {/*   <StudyKitCard key={kit._id} studyKit={kit} /> */}
          {/* ))} */}
          <Link to="/study-kit/create" className="block">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="h-full"
            >
              <motion.div
                className="border-2 border-dashed rounded-lg p-6 h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
                style={{
                  borderColor: isHovered
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--border))',
                  backgroundColor: isHovered
                    ? 'hsl(var(--primary-foreground))'
                    : 'transparent',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Background pattern that appears on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0"
                  animate={{ opacity: isHovered ? 0.05 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, hsl(var(--primary)) 10%, transparent 60%)',
                    backgroundSize: '100px 100px',
                    backgroundPosition: 'center',
                  }}
                />

                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative "
                  style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                  animate={{
                    backgroundColor: isHovered
                      ? 'hsl(var(--primary) / 0.2)'
                      : 'hsl(var(--primary) / 0.1)',
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Pulse effect ring */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-muted-foreground opacity-50"
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      style={{ border: '2px solid hsl(var(--primary) / 0.3)' }}
                    />
                  )}

                  <motion.div
                    animate={{ rotate: isHovered ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="text-primary w-8 h-8" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  className="text-lg font-medium mb-2 text-foreground"
                  animate={{ y: isHovered ? -2 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Create New Study Kit
                </motion.h3>

                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: isHovered ? 1 : 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  Start a new learning journey with a fresh Study Kit
                </motion.p>

                {/* Animated arrow that appears on hover */}
                <motion.div
                  className="mt-4 flex items-center justify-center gap-1 text-primary font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Get started</span>
                  <motion.span
                    animate={{ x: isHovered ? 3 : 0 }}
                    transition={{
                      duration: 0.2,
                      repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                      repeatType: 'reverse',
                    }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* <GettingStartedGuide /> */}
    </main>
  );
}
