export interface ChatItem {
  _id: string;
  title: string;
  date: string;
}

export interface VideoItem {
  _id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
}

export interface FlashcardDeck {
  _id: string;
  title: string;
  count: number;
  mastery: number;
  lastStudied: string;
}

export interface QuizItem {
  _id: string;
  title: string;
  score: number;
  questions: number;
  date: string;
}

export interface StudyKit {
  _id: string;
  name: string;
  description: string;
  progress: {
    percentage: number;
    lastActivity: string;
  };
  colorTheme: string;
  chatItems?: ChatItem[];
  videoItems?: VideoItem[];
  flashcardDecks?: FlashcardDeck[];
  quizItems?: QuizItem[];
}

export interface Data {
  studyKits: StudyKit[];
  recentActivities: {
    _id: string;
    title: string;
    type: string;
    time: string;
  }[];
  bookmarkedItems: { _id: string; title: string; type: string }[];
}

export const data: Data = {
  studyKits: [
    {
      _id: '1',
      name: 'Calculus Fundamentals',
      description:
        'Learn the basics of calculus including limits, derivatives, and integrals',
      progress: {
        percentage: 65,
        lastActivity: '2023-11-15T14:30:00Z',
      },
      colorTheme: '#1E88E5',
      chatItems: [
        { _id: '1', title: 'Derivatives Discussion', date: 'Nov 15, 2023' },
        { _id: '2', title: 'Limits Explanation', date: 'Nov 14, 2023' },
        { _id: '3', title: 'Integration Help', date: 'Nov 13, 2023' },
      ],
      videoItems: [
        {
          _id: '1',
          title: 'Understanding Derivatives',
          thumbnail: '/3b1bmath.png?height=180&width=320',
          duration: '5:32',
          date: 'Nov 15, 2023',
        },
        {
          _id: '2',
          title: 'Limits Explained',
          thumbnail: '/3b1bmath.png?height=180&width=320',
          duration: '4:18',
          date: 'Nov 14, 2023',
        },
        {
          _id: '3',
          title: 'Integration Techniques',
          thumbnail: '/3b1bmath.png?height=180&width=320',
          duration: '7:45',
          date: 'Nov 13, 2023',
        },
      ],
      flashcardDecks: [
        {
          _id: '1',
          title: 'Derivatives',
          count: 12,
          mastery: 75,
          lastStudied: '2 days ago',
        },
        {
          _id: '2',
          title: 'Limits',
          count: 8,
          mastery: 45,
          lastStudied: 'Yesterday',
        },
        {
          _id: '3',
          title: 'Integration',
          count: 15,
          mastery: 30,
          lastStudied: '3 days ago',
        },
      ],
      quizItems: [
        {
          _id: '1',
          title: 'Derivatives Quiz',
          score: 85,
          questions: 20,
          date: 'Nov 16, 2023',
        },
        {
          _id: '2',
          title: 'Limits Quiz',
          score: 70,
          questions: 20,
          date: 'Nov 14, 2023',
        },
        {
          _id: '3',
          title: 'Integration Quiz',
          score: 65,
          questions: 20,
          date: 'Nov 10, 2023',
        },
      ],
    },
    {
      _id: '2',
      name: 'Organic Chemistry',
      description:
        'Study organic compounds, reactions, and laboratory techniques',
      progress: {
        percentage: 65,
        lastActivity: '2023-11-15T14:30:00Z',
      },
      colorTheme: '#7CB342',
      chatItems: [
        { _id: '1', title: 'Reaction Mechanisms', date: 'Nov 14, 2023' },
        { _id: '2', title: 'Functional Groups', date: 'Nov 13, 2023' },
      ],
      videoItems: [
        {
          _id: '1',
          title: 'Introduction to Organic Chemistry',
          thumbnail: '/3b1bchem.png?height=180&width=320',
          duration: '6:15',
          date: 'Nov 14, 2023',
        },
        {
          _id: '2',
          title: 'Reaction Mechanisms Explained',
          thumbnail: '/3b1bchem.png?height=180&width=320',
          duration: '8:20',
          date: 'Nov 13, 2023',
        },
      ],
      flashcardDecks: [
        {
          _id: '1',
          title: 'Functional Groups',
          count: 10,
          mastery: 50,
          lastStudied: 'Yesterday',
        },
        {
          _id: '2',
          title: 'Reaction Mechanisms',
          count: 15,
          mastery: 40,
          lastStudied: '2 days ago',
        },
      ],
      quizItems: [
        {
          _id: '1',
          title: 'Functional Groups Quiz',
          score: 60,
          questions: 15,
          date: 'Nov 14, 2023',
        },
        {
          _id: '2',
          title: 'Reaction Mechanisms Quiz',
          score: 55,
          questions: 15,
          date: 'Nov 12, 2023',
        },
      ],
    },
    {
      _id: '3',
      name: 'World History',
      description:
        'Explore major historical events and their impact on modern society',
      progress: {
        percentage: 65,
        lastActivity: '2023-11-15T14:30:00Z',
      },
      colorTheme: '#FFA000',
      chatItems: [
        { _id: '1', title: 'World War I Discussion', date: 'Nov 16, 2023' },
        { _id: '2', title: 'Cold War Analysis', date: 'Nov 15, 2023' },
      ],
      videoItems: [
        {
          _id: '1',
          title: 'World War I Overview',
          thumbnail: '/3b1bhistory.png?height=180&width=320',
          duration: '9:10',
          date: 'Nov 16, 2023',
        },
        {
          _id: '2',
          title: 'Cold War Explained',
          thumbnail: '/3b1bhistory.png?height=180&width=320',
          duration: '10:05',
          date: 'Nov 15, 2023',
        },
      ],
      flashcardDecks: [
        {
          _id: '1',
          title: 'World War I',
          count: 20,
          mastery: 80,
          lastStudied: 'Today',
        },
        {
          _id: '2',
          title: 'Cold War',
          count: 18,
          mastery: 70,
          lastStudied: 'Yesterday',
        },
      ],
      quizItems: [
        {
          _id: '1',
          title: 'World War I Quiz',
          score: 90,
          questions: 25,
          date: 'Nov 16, 2023',
        },
        {
          _id: '2',
          title: 'Cold War Quiz',
          score: 85,
          questions: 25,
          date: 'Nov 15, 2023',
        },
      ],
    },
  ],
  recentActivities: [
    { _id: '1', title: 'Derivatives Quiz', type: 'quiz', time: '2 hours ago' },
    {
      _id: '2',
      title: 'Limits Flashcards',
      type: 'flashcards',
      time: 'Yesterday',
    },
    { _id: '3', title: 'Integration Video', type: 'video', time: '2 days ago' },
  ],
  bookmarkedItems: [
    { _id: '1', title: 'Reaction Mechanisms Explained', type: 'video' },
    { _id: '2', title: 'Functional Groups Flashcards', type: 'flashcards' },
  ],
};
