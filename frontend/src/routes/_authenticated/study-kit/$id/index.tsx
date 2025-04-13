import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Video,
  BookOpen,
  FileQuestion,
  Clock,
  BarChart,
  FolderDot,
  CalendarClock,
} from 'lucide-react';
import { VideoGenerator } from '@/components/custom/video-generator';
import { FlashCards } from '@/components/custom/flash-cards';
import { QuizGenerator } from '@/components/custom/quiz-generator';
import { createFileRoute } from '@tanstack/react-router';
import type { StudyKit } from '@/dummy';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { OrbitLoader } from '@/components/custom/loader';
import { Skeleton } from '@/components/ui/skeleton';
import { colorOptions } from '../create';
import Backgrounds from '@/components/custom/Backgrounds';
import { useState } from 'react';
import { ChatInterface } from '@/components/custom/ChatInterface';

export const Route = createFileRoute('/_authenticated/study-kit/$id/')({
  component: StudyKitPage,
});

type Conversation = {
  id: string;
  title: string;
  studyKitId: string;
  userId: string;
  createdAt: string;
  lastMessageAt: string;
  updatedAt: string;
};

export default function StudyKitPage() {
  const { id } = Route.useParams();
  const {
    isPending,
    isLoading,
    isRefetching,
    data: studykit,
  } = useQuery<StudyKit, Error>({
    queryKey: ['Studykit', id],
    queryFn: async () => {
      return await api.get(`/studykit/${id}`).then((res) => {
        return res.data;
      });
    },
  });

  const { data: conversations, isLoading: isConversationLoading } = useQuery<
    Conversation[],
    Error
  >({
    queryKey: ['conversationId', id],
    queryFn: async () => {
      return await api.get(`/conversations/${id}`).then((res) => {
        console.log(res.data);
        return res.data;
      });
    },
  });
  const [activeView, setActiveView] = useState<'chat' | 'library'>('chat');

  // const studykit = error
  //  ? dummy.studyKits.find((kit) => kit._id === id)
  //  : data?.data;
  // const studykit = dummy.studyKits.find((kit) => kit._id === id);
  // const studykit = error
  //   ? dummy.studyKits.find((kit) => kit._id === id)
  //   : data?.data;
  if (!studykit) {
    return <div>Study Kit not found</div>;
  }

  const colorTheme = colorOptions.find(
    (color) => color.value.hex === studykit.colorTheme,
  )?.value;
  return (
    <div className="container mx-auto px-4 h-screen flex flex-col flex-1">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold text-black">
              {studykit.name}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('chat')}
                className={`px-3 py-1 text-sm cursor-pointer rounded-md ${activeView === 'chat' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                type="button"
              >
                Chat
              </button>
              <button
                onClick={() => setActiveView('library')}
                className={`px-3 py-1 text-sm cursor-pointer rounded-md ${activeView === 'library' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                type="button"
              >
                Library
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress: 65%</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[65%]" />
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden w-full">
        {activeView === 'chat' && !isConversationLoading && conversations ? (
          <ChatInterface
            studyKit={studykit}
            conversationId={conversations[0].id}
          />
        ) : (
          <div>
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden mb-6">
                <div className="aspect-[4/1] w-full overflow-hidden">
                  <Backgrounds
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    colorTheme={colorTheme!}
                    type={studykit.colorTheme}
                    small={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0  p-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-background">
                      {studykit.name}
                    </h1>
                    <p className="text-background/70 mt-1">
                      {studykit.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">Edit Kit</Button>
                    <Button
                      style={{
                        backgroundColor: colorTheme?.hex,
                      }}
                    >
                      Add Resource
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main content area - 3/4 width */}
              <div className="lg:col-span-3 ">
                {isLoading || isRefetching || isPending ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <OrbitLoader size="lg" color="primary" showText={false} />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Videos Section */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                          <Video
                            style={{ color: colorTheme?.hex }}
                            className="h-5 w-5 mr-2"
                          />
                          Explanatory Videos
                        </h2>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              style={{
                                backgroundColor: colorTheme?.hex,
                              }}
                            >
                              Create Video
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>
                                Generate Explanatory Video
                              </DialogTitle>
                            </DialogHeader>
                            <div className="h-full overflow-auto">
                              <VideoGenerator studyKitId={id} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studykit.videoItems?.map((video: any) => (
                          <Dialog key={video.id}>
                            <DialogTrigger asChild>
                              <Card className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
                                <div className="relative">
                                  <img
                                    src={video.thumbnail || '/placeholder.svg'}
                                    alt={video.title}
                                    className="w-full aspect-video object-cover"
                                  />
                                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {video.duration}
                                  </div>
                                </div>
                                <CardHeader className="p-4">
                                  <CardTitle className="text-base">
                                    {video.title}
                                  </CardTitle>
                                  <CardDescription>
                                    {video.date}
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>{video.title}</DialogTitle>
                                <DialogClose />
                              </DialogHeader>
                              <div className="h-full overflow-auto">
                                <div className="aspect-video bg-black rounded-lg mb-4">
                                  <img
                                    src={video.thumbnail || '/placeholder.svg'}
                                    alt={video.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium">
                                    {video.title}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    This is a sample video explanation. In a
                                    real application, this would be a video
                                    explaining the concept.
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </section>

                    {/* Flash Cards Section */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                          <BookOpen
                            style={{ color: colorTheme?.hex }}
                            className="h-5 w-5 mr-2"
                          />
                          Flash Cards
                        </h2>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              style={{
                                backgroundColor: colorTheme?.hex,
                              }}
                            >
                              Create Deck
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Create Flash Cards</DialogTitle>
                            </DialogHeader>
                            <div className="h-full overflow-auto">
                              <FlashCards studyKitId={id} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studykit.flashcardDecks?.map((deck: any) => {
                          return (
                            <Dialog key={deck.id}>
                              <DialogTrigger asChild>
                                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                  <CardHeader className="p-4">
                                    <CardTitle className="text-base">
                                      {deck.title}
                                    </CardTitle>
                                    <CardDescription>
                                      {deck.count} cards • Last studied{' '}
                                      {deck.lastStudied}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="p-4 pt-0">
                                    <div className="flex justify-between text-sm">
                                      <span>Mastery:</span>
                                      <span
                                        className={`font-medium ${
                                          deck.mastery > 70
                                            ? 'text-green-600'
                                            : deck.mastery > 40
                                              ? 'text-amber-600'
                                              : 'text-red-600'
                                        }`}
                                      >
                                        {deck.mastery}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                      <div
                                        className={`h-2 rounded-full ${
                                          deck.mastery > 70
                                            ? 'bg-green-600'
                                            : deck.mastery > 40
                                              ? 'bg-amber-600'
                                              : 'bg-red-600'
                                        }`}
                                        style={{ width: `${deck.mastery}%` }}
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              </DialogTrigger>
                              <DialogContent className="w-screen h-screen sm:max-w-screen">
                                <DialogHeader>
                                  <DialogTitle>
                                    {deck.title} Flash Cards
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="h-full overflow-auto">
                                  <FlashCards studyKitId={id} />
                                </div>
                              </DialogContent>
                            </Dialog>
                          );
                        })}
                      </div>
                    </section>

                    {/* Quizzes Section */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                          <FileQuestion
                            style={{ color: colorTheme?.hex }}
                            className="h-5 w-5 mr-2"
                          />
                          Quizzes
                        </h2>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              style={{
                                backgroundColor: colorTheme?.hex,
                              }}
                            >
                              Create Quiz
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Create Quiz</DialogTitle>
                            </DialogHeader>
                            <div className="h-full overflow-auto">
                              <QuizGenerator studyKitId={id} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studykit.quizItems?.map((quiz: any) => (
                          <Dialog key={quiz.id}>
                            <DialogTrigger asChild>
                              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader className="p-4">
                                  <CardTitle className="text-base">
                                    {quiz.title}
                                  </CardTitle>
                                  <CardDescription>{quiz.date}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                      <span className="font-bold">
                                        {quiz.score}%
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-sm">
                                        {Math.round(
                                          (quiz.score * quiz.questions) / 100,
                                        )}
                                        /{quiz.questions} correct
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </DialogTrigger>
                            <DialogContent className="w-screen h-screen sm:max-w-screen">
                              <DialogHeader>
                                <DialogTitle>{quiz.title}</DialogTitle>
                              </DialogHeader>
                              <div className="h-full overflow-auto">
                                <QuizGenerator studyKitId={id} />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </section>
                    {/* Stats sidebar - 1/4 width */}
                  </div>
                )}
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                  {/* Study Time Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Study Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading || isRefetching ? (
                        <>
                          <Skeleton className="bg-muted-foreground/20 h-8 w-24 mb-1" />
                          <Skeleton className="bg-muted-foreground/20 h-3 w-32" />
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">12.5 hours</div>
                          <p className="text-xs text-muted-foreground">
                            +2.3 hours this week
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Progress Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <BarChart className="h-4 w-4 mr-2" />
                        Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading || isRefetching ? (
                        <>
                          <Skeleton className="bg-muted-foreground/20 h-8 w-16 mb-1" />
                          <Skeleton className="bg-muted-foreground/20 h-3 w-28 mb-2" />
                          <Skeleton className="bg-muted-foreground/20 h-2 w-full rounded-full" />
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">
                            {studykit.progress?.percentage}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +5% from last week
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${studykit.progress?.percentage}%`,
                              }}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quiz Performance Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <FileQuestion className="h-4 w-4 mr-2" />
                        Quiz Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading || isRefetching ? (
                        <>
                          <Skeleton className="bg-muted-foreground/20 h-8 w-16 mb-1" />
                          <Skeleton className="bg-muted-foreground/20 h-3 w-40" />
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">85%</div>
                          <p className="text-xs text-muted-foreground">
                            Average score on 5 quizzes
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {isLoading || isRefetching ? (
                        <div className="text-sm">
                          <div className="border-b py-3 px-4">
                            <Skeleton className="bg-muted-foreground/20 h-4 w-48 mb-1" />
                            <Skeleton className="bg-muted-foreground/20 h-3 w-20" />
                          </div>
                          <div className="border-b py-3 px-4">
                            <Skeleton className="bg-muted-foreground/20 h-4 w-40 mb-1" />
                            <Skeleton className="bg-muted-foreground/20 h-3 w-16" />
                          </div>
                          <div className="py-3 px-4">
                            <Skeleton className="bg-muted-foreground/20 h-4 w-44 mb-1" />
                            <Skeleton className="bg-muted-foreground/20 h-3 w-24" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div className="border-b py-3 px-4">
                            <div className="font-medium">
                              Completed Derivatives Quiz
                            </div>
                            <div className="text-xs text-muted-foreground">
                              2 hours ago
                            </div>
                          </div>
                          <div className="border-b py-3 px-4">
                            <div className="font-medium">
                              Studied Limits Flashcards
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Yesterday
                            </div>
                          </div>
                          <div className="py-3 px-4">
                            <div className="font-medium">
                              Watched Integration Video
                            </div>
                            <div className="text-xs text-muted-foreground">
                              2 days ago
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Resources Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <FolderDot className="h-4 w-4 mr-2" />
                        Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {isLoading || isRefetching ? (
                        <div className="text-sm">
                          <div className="border-b py-3 px-4">
                            <Skeleton className="bg-muted-foreground/20 h-4 w-36 mb-1" />
                            <Skeleton className="bg-muted-foreground/20 h-3 w-28" />
                          </div>
                          <div className="border-b py-3 px-4">
                            <Skeleton className="bg-muted-foreground/20 h-4 w-40 mb-1" />
                            <Skeleton className="bg-muted-foreground/20 h-3 w-24" />
                          </div>
                          <div className="py-3 px-4">
                            <Skeleton className="bg-muted-foreground/20 h-4 w-44 mb-1" />
                            <Skeleton className="bg-muted-foreground/20 h-3 w-32" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div className="border-b py-3 px-4">
                            <div className="font-medium">
                              Calculus Textbook.pdf
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Added 3 days ago
                            </div>
                          </div>
                          <div className="border-b py-3 px-4">
                            <div className="font-medium">
                              Derivatives Notes.docx
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Added yesterday
                            </div>
                          </div>
                          <div className="py-3 px-4">
                            <div className="font-medium">
                              Integration Examples.pdf
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Added 5 hours ago
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
