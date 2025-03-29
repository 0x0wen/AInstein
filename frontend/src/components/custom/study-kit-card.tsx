import { Link } from '@tanstack/react-router';
import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StudyKit } from '@/dummy';

interface StudyKitCardProps {
  studyKit: StudyKit;
}

export function StudyKitCard({ studyKit }: StudyKitCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const lastAccessed = new Date(studyKit.progress.lastActivity);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(lastAccessed);

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

  return (
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
      <Link
        to={'/study-kit/$id'}
        params={{ id: studyKit._id }}
        className="block h-full"
      >
        <Card
          className="h-full overflow-hidden relative border-2 transition-all duration-300"
          style={{
            borderColor: isHovered ? studyKit.colorTheme : 'transparent',
            boxShadow: isHovered
              ? `0 10px 25px -5px ${studyKit.colorTheme}30`
              : 'none',
          }}
        >
          <motion.div
            className="h-2"
            style={{ backgroundColor: studyKit.colorTheme }}
            animate={{ width: isHovered ? '100%' : '100%' }}
            initial={{ width: '30%' }}
            transition={{ duration: 0.3 }}
          />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <motion.h3
                  className="text-lg font-semibold mb-2"
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {studyKit.name}
                </motion.h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {studyKit.description}
                </p>
              </div>
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${studyKit.colorTheme}20` }}
                animate={{
                  rotate: isHovered ? 5 : 0,
                  scale: isHovered ? 1.1 : 1,
                  backgroundColor: isHovered
                    ? `${studyKit.colorTheme}40`
                    : `${studyKit.colorTheme}20`,
                }}
                transition={{ duration: 0.3 }}
              >
                <BookOpen
                  className="h-5 w-5"
                  style={{ color: studyKit.colorTheme }}
                />
              </motion.div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{studyKit.progress.percentage}%</span>
                </div>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: isVisible ? '100%' : '0%' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Progress
                    value={studyKit.progress.percentage}
                    className="h-2"
                    style={{
                      background: isHovered
                        ? `${studyKit.colorTheme}20`
                        : undefined,
                    }}
                  />
                </motion.div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last accessed: {formattedDate}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter
            className="bg-gray-50 px-6 py-3 border-t relative z-10 transition-colors duration-300"
            style={{
              backgroundColor: isHovered
                ? `${studyKit.colorTheme}10`
                : undefined,
            }}
          >
            <div className="flex justify-between items-center w-full">
              <span
                className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-700 transition-colors duration-300"
                style={{
                  backgroundColor: isHovered
                    ? `${studyKit.colorTheme}30`
                    : undefined,
                  color: isHovered ? studyKit.colorTheme : undefined,
                }}
              ></span>
              <motion.div
                animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight
                  className="h-4 w-4"
                  style={{ color: studyKit.colorTheme }}
                />
              </motion.div>
            </div>
          </CardFooter>

          {/* Background gradient effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.05 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at 50% 0%, ${studyKit.colorTheme}, transparent 70%)`,
            }}
          />
        </Card>
      </Link>
    </motion.div>
  );
}
