"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Video, BookOpen, FileQuestion, Clock, BarChart } from "lucide-react"
import { ChatInterface } from "@/components/custom/chat-interface"
import { VideoGenerator } from "@/components/custom/video-generator"
import { FlashCards } from "@/components/custom/flash-cards"
import { QuizGenerator } from "@/components/custom/quiz-generator"

interface StudyKitPageProps {
  params: {
    id: string
  }
}

export default function StudyKitPage({ params }: StudyKitPageProps) {
  // In a real app, you would fetch the study kit data based on the ID
  const studyKit = {
    id: params.id,
    name: "Calculus Fundamentals",
    description: "Learn the basics of calculus including limits, derivatives, and integrals",
    subject: "Mathematics",
    progress: 65,
    lastAccessed: "2023-11-15T14:30:00Z",
    color: "#1E88E5",
  }

  // Sample data for each content type
  const chatItems = [
    { id: "1", title: "Derivatives Discussion", date: "Nov 15, 2023" },
    { id: "2", title: "Limits Explanation", date: "Nov 14, 2023" },
    { id: "3", title: "Integration Help", date: "Nov 13, 2023" },
  ]

  const videoItems = [
    {
      id: "1",
      title: "Understanding Derivatives",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "5:32",
      date: "Nov 15, 2023",
    },
    {
      id: "2",
      title: "Limits Explained",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "4:18",
      date: "Nov 14, 2023",
    },
    {
      id: "3",
      title: "Integration Techniques",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "7:45",
      date: "Nov 13, 2023",
    },
  ]

  const flashcardDecks = [
    { id: "1", title: "Derivatives", count: 12, mastery: 75, lastStudied: "2 days ago" },
    { id: "2", title: "Limits", count: 8, mastery: 45, lastStudied: "Yesterday" },
    { id: "3", title: "Integration", count: 15, mastery: 30, lastStudied: "3 days ago" },
  ]

  const quizItems = [
    { id: "1", title: "Derivatives Quiz", score: 85, questions: 20, date: "Nov 16, 2023" },
    { id: "2", title: "Limits Quiz", score: 70, questions: 20, date: "Nov 14, 2023" },
    { id: "3", title: "Integration Quiz", score: 65, questions: 20, date: "Nov 10, 2023" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{studyKit.name}</h1>
            <p className="text-muted-foreground mt-1">{studyKit.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Edit Kit</Button>
            <Button>Add Resource</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area - 3/4 width */}
        <div className="lg:col-span-3 space-y-8">
          {/* Chat Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Conversations
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>New Chat</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Chat with AInstein</DialogTitle>
                  </DialogHeader>
                  <div className="h-full overflow-hidden">
                    <ChatInterface studyKitId={params.id} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chatItems.map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription>{item.date}</CardDescription>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                    </DialogHeader>
                    <div className="h-full overflow-hidden">
                      <ChatInterface studyKitId={params.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>

          {/* Videos Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Video className="h-5 w-5 mr-2 text-primary" />
                Explanatory Videos
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create Video</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Generate Explanatory Video</DialogTitle>
                  </DialogHeader>
                  <div className="h-full overflow-auto">
                    <VideoGenerator studyKitId={params.id} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoItems.map((video) => (
                <Dialog key={video.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription>{video.date}</CardDescription>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{video.title}</DialogTitle>
                    </DialogHeader>
                    <div className="h-full overflow-auto">
                      <div className="aspect-video bg-black rounded-lg mb-4">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{video.title}</h3>
                        <p className="text-muted-foreground">
                          This is a sample video explanation. In a real application, this would be a video explaining
                          the concept.
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
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Flash Cards
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create Deck</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Create Flash Cards</DialogTitle>
                  </DialogHeader>
                  <div className="h-full overflow-auto">
                    <FlashCards studyKitId={params.id} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcardDecks.map((deck) => (
                <Dialog key={deck.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{deck.title}</CardTitle>
                        <CardDescription>
                          {deck.count} cards • Last studied {deck.lastStudied}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-sm">
                          <span>Mastery:</span>
                          <span
                            className={`font-medium ${
                              deck.mastery > 70
                                ? "text-green-600"
                                : deck.mastery > 40
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {deck.mastery}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              deck.mastery > 70 ? "bg-green-600" : deck.mastery > 40 ? "bg-amber-600" : "bg-red-600"
                            }`}
                            style={{ width: `${deck.mastery}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{deck.title} Flash Cards</DialogTitle>
                    </DialogHeader>
                    <div className="h-full overflow-auto">
                      <FlashCards studyKitId={params.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>

          {/* Quizzes Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FileQuestion className="h-5 w-5 mr-2 text-primary" />
                Quizzes
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create Quiz</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Create Quiz</DialogTitle>
                  </DialogHeader>
                  <div className="h-full overflow-auto">
                    <QuizGenerator studyKitId={params.id} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizItems.map((quiz) => (
                <Dialog key={quiz.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.date}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="font-bold">{quiz.score}%</span>
                          </div>
                          <div>
                            <div className="text-sm">
                              {Math.round((quiz.score * quiz.questions) / 100)}/{quiz.questions} correct
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{quiz.title}</DialogTitle>
                    </DialogHeader>
                    <div className="h-full overflow-auto">
                      <QuizGenerator studyKitId={params.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>
        </div>

        {/* Stats sidebar - 1/4 width */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5 hours</div>
                <p className="text-xs text-muted-foreground">+2.3 hours this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart className="h-4 w-4 mr-2" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studyKit.progress}%</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${studyKit.progress}%` }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileQuestion className="h-4 w-4 mr-2" />
                  Quiz Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Average score on 5 quizzes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-sm">
                  <div className="border-b py-3 px-4">
                    <div className="font-medium">Completed Derivatives Quiz</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="border-b py-3 px-4">
                    <div className="font-medium">Studied Limits Flashcards</div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </div>
                  <div className="py-3 px-4">
                    <div className="font-medium">Watched Integration Video</div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-sm">
                  <div className="border-b py-3 px-4">
                    <div className="font-medium">Calculus Textbook.pdf</div>
                    <div className="text-xs text-muted-foreground">Added 3 days ago</div>
                  </div>
                  <div className="border-b py-3 px-4">
                    <div className="font-medium">Derivatives Notes.docx</div>
                    <div className="text-xs text-muted-foreground">Added yesterday</div>
                  </div>
                  <div className="py-3 px-4">
                    <div className="font-medium">Integration Examples.pdf</div>
                    <div className="text-xs text-muted-foreground">Added 5 hours ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

