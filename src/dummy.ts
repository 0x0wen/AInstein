export interface ChatItem {
  id: string;
  title: string;
  date: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  count: number;
  mastery: number;
  lastStudied: string;
}

export interface QuizItem {
  id: string;
  title: string;
  score: number;
  questions: number;
  date: string;
}

export interface StudyKit {
  id: string;
  name: string;
  description: string;
  subject: string;
  progress: number;
  lastAccessed: string;
  color: string;
  chatItems?: ChatItem[];
  videoItems?: VideoItem[];
  flashcardDecks?: FlashcardDeck[];
  quizItems?: QuizItem[];
}

export interface Data {
  studyKits: StudyKit[];
}

export const data: Data = {
  studyKits: [
    {
      id: "1",
      name: "Calculus Fundamentals",
      description: "Learn the basics of calculus including limits, derivatives, and integrals",
      subject: "Mathematics",
      progress: 65,
      lastAccessed: "2023-11-15T14:30:00Z",
      color: "#1E88E5",
      chatItems: [
        { id: "1", title: "Derivatives Discussion", date: "Nov 15, 2023" },
        { id: "2", title: "Limits Explanation", date: "Nov 14, 2023" },
        { id: "3", title: "Integration Help", date: "Nov 13, 2023" },
      ],
      videoItems: [
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
      ],
      flashcardDecks: [
        { id: "1", title: "Derivatives", count: 12, mastery: 75, lastStudied: "2 days ago" },
        { id: "2", title: "Limits", count: 8, mastery: 45, lastStudied: "Yesterday" },
        { id: "3", title: "Integration", count: 15, mastery: 30, lastStudied: "3 days ago" },
      ],
      quizItems: [
        { id: "1", title: "Derivatives Quiz", score: 85, questions: 20, date: "Nov 16, 2023" },
        { id: "2", title: "Limits Quiz", score: 70, questions: 20, date: "Nov 14, 2023" },
        { id: "3", title: "Integration Quiz", score: 65, questions: 20, date: "Nov 10, 2023" },
      ],
    },
    {
      id: "2",
      name: "Organic Chemistry",
      description: "Study organic compounds, reactions, and laboratory techniques",
      subject: "Chemistry",
      progress: 32,
      lastAccessed: "2023-11-14T09:15:00Z",
      color: "#7CB342",
      chatItems: [
        { id: "1", title: "Reaction Mechanisms", date: "Nov 14, 2023" },
        { id: "2", title: "Functional Groups", date: "Nov 13, 2023" },
      ],
      videoItems: [
        {
          id: "1",
          title: "Introduction to Organic Chemistry",
          thumbnail: "/placeholder.svg?height=180&width=320",
          duration: "6:15",
          date: "Nov 14, 2023",
        },
        {
          id: "2",
          title: "Reaction Mechanisms Explained",
          thumbnail: "/placeholder.svg?height=180&width=320",
          duration: "8:20",
          date: "Nov 13, 2023",
        },
      ],
      flashcardDecks: [
        { id: "1", title: "Functional Groups", count: 10, mastery: 50, lastStudied: "Yesterday" },
        { id: "2", title: "Reaction Mechanisms", count: 15, mastery: 40, lastStudied: "2 days ago" },
      ],
      quizItems: [
        { id: "1", title: "Functional Groups Quiz", score: 60, questions: 15, date: "Nov 14, 2023" },
        { id: "2", title: "Reaction Mechanisms Quiz", score: 55, questions: 15, date: "Nov 12, 2023" },
      ],
    },
    {
      id: "3",
      name: "World History",
      description: "Explore major historical events and their impact on modern society",
      subject: "History",
      progress: 78,
      lastAccessed: "2023-11-16T16:45:00Z",
      color: "#FFA000",
      chatItems: [
        { id: "1", title: "World War I Discussion", date: "Nov 16, 2023" },
        { id: "2", title: "Cold War Analysis", date: "Nov 15, 2023" },
      ],
      videoItems: [
        {
          id: "1",
          title: "World War I Overview",
          thumbnail: "/placeholder.svg?height=180&width=320",
          duration: "9:10",
          date: "Nov 16, 2023",
        },
        {
          id: "2",
          title: "Cold War Explained",
          thumbnail: "/placeholder.svg?height=180&width=320",
          duration: "10:05",
          date: "Nov 15, 2023",
        },
      ],
      flashcardDecks: [
        { id: "1", title: "World War I", count: 20, mastery: 80, lastStudied: "Today" },
        { id: "2", title: "Cold War", count: 18, mastery: 70, lastStudied: "Yesterday" },
      ],
      quizItems: [
        { id: "1", title: "World War I Quiz", score: 90, questions: 25, date: "Nov 16, 2023" },
        { id: "2", title: "Cold War Quiz", score: 85, questions: 25, date: "Nov 15, 2023" },
      ],
    },
  ],
};