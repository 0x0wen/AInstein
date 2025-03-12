import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface StudyKitCardProps {
  studyKit: {
    id: string;
    name: string;
    description: string;
    subject: string;
    progress: number;
    lastAccessed: string;
    color: string;
  };
}

export function StudyKitCard({ studyKit }: StudyKitCardProps) {
  // Format the last accessed date
  const lastAccessed = new Date(studyKit.lastAccessed);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(lastAccessed);

  return (
    <Link to={'/study-kit/$id'} params={{ id: studyKit.id }}>
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-2" style={{ backgroundColor: studyKit.color }} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">{studyKit.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {studyKit.description}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${studyKit.color}20` }}
            >
              <BookOpen className="h-5 w-5" style={{ color: studyKit.color }} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{studyKit.progress}%</span>
              </div>
              <Progress value={studyKit.progress} className="h-2" />
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last accessed: {formattedDate}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-3 border-t">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-700">
            {studyKit.subject}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
