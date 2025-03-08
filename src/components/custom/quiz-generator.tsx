"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Upload, Clock, BarChart, CheckCircle, XCircle, ArrowRight } from "lucide-react"

interface QuizGeneratorProps {
  studyKitId: string
}

export function QuizGenerator({ studyKitId }: QuizGeneratorProps) {
  const [activeTab, setActiveTab] = useState("create")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Sample quiz data
  const quiz = {
    title: "Derivatives Quiz",
    questions: [
      {
        id: 1,
        question: "What is the derivative of x²?",
        options: [
          { id: "a", text: "2x" },
          { id: "b", text: "x" },
          { id: "c", text: "2" },
          { id: "d", text: "x²" },
        ],
        correctAnswer: "a",
      },
      {
        id: 2,
        question: "Which of the following is the chain rule?",
        options: [
          { id: "a", text: "d/dx[f(g(x))] = f'(g(x)) · g'(x)" },
          { id: "b", text: "d/dx[f(x) · g(x)] = f'(x) · g(x) + f(x) · g'(x)" },
          { id: "c", text: "d/dx[f(x)/g(x)] = [f'(x) · g(x) - f(x) · g'(x)]/[g(x)]²" },
          { id: "d", text: "d/dx[f(x) + g(x)] = f'(x) + g'(x)" },
        ],
        correctAnswer: "a",
      },
      {
        id: 3,
        question: "What is the derivative of e^x?",
        options: [
          { id: "a", text: "e^x" },
          { id: "b", text: "x · e^(x-1)" },
          { id: "c", text: "ln(x)" },
          { id: "d", text: "1/x" },
        ],
        correctAnswer: "a",
      },
    ],
  }

  const handleSelectAnswer = (questionIndex: number, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerId,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    }
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="create">Create Quiz</TabsTrigger>
          <TabsTrigger value="take">Take Quiz</TabsTrigger>
          <TabsTrigger value="history">Quiz History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Generate a Quiz</CardTitle>
              <CardDescription>Create a quiz based on your Study Kit materials to test your knowledge.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload Material</h3>
                  <p className="text-sm text-muted-foreground mb-4">Generate a quiz from your notes or textbooks</p>
                  <Button>Browse Files</Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Quiz Settings</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Quiz Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md mt-1"
                        placeholder="Enter quiz title..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Question Type</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option>Multiple Choice</option>
                        <option>True/False</option>
                        <option>Short Answer</option>
                        <option>Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Number of Questions</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option>5 questions</option>
                        <option>10 questions</option>
                        <option>15 questions</option>
                        <option>20 questions</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Difficulty Level</label>
                      <select className="w-full p-2 border rounded-md mt-1">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                        <option>Mixed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Generate Quiz</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="take" className="mt-0">
          {!quizSubmitted ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>Test your knowledge of derivatives</CardDescription>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>15:00 remaining</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-4">
                  <h3 className="text-xl font-medium mb-6">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </h3>
                  <p className="text-lg mb-6">{quiz.questions[currentQuestion].question}</p>

                  <RadioGroup
                    value={selectedAnswers[currentQuestion] || ""}
                    onValueChange={(value) => handleSelectAnswer(currentQuestion, value)}
                    className="space-y-3"
                  >
                    {quiz.questions[currentQuestion].options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                          selectedAnswers[currentQuestion] === option.id ? "bg-primary/10 border-primary" : ""
                        }`}
                        onClick={() => handleSelectAnswer(currentQuestion, option.id)}
                      >
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                        <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                  Previous
                </Button>

                {currentQuestion < quiz.questions.length - 1 ? (
                  <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestion]}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmitQuiz} disabled={!selectedAnswers[currentQuestion]}>
                    Submit Quiz
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results: {quiz.title}</CardTitle>
                <CardDescription>Completed on {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold">{calculateScore().percentage}%</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {calculateScore().correct} out of {calculateScore().total} correct
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    {calculateScore().percentage >= 70
                      ? "Great job! You're mastering this topic."
                      : "Keep practicing to improve your score."}
                  </p>

                  <div className="w-full max-w-md space-y-6">
                    {quiz.questions.map((question, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          {selectedAnswers[index] === question.correctAnswer ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Correct</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Incorrect</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm mb-2">{question.question}</p>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Your answer:</span>{" "}
                          {question.options.find((opt) => opt.id === selectedAnswers[index])?.text || "Not answered"}
                        </div>
                        {selectedAnswers[index] !== question.correctAnswer && (
                          <div className="text-sm text-green-600 mt-1">
                            <span className="font-medium">Correct answer:</span>{" "}
                            {question.options.find((opt) => opt.id === question.correctAnswer)?.text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Review Material</Button>
                <Button>Try Again</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Quiz History</CardTitle>
                  <Button variant="outline" size="sm">
                    <BarChart className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Derivatives Quiz</h3>
                      <div className="text-sm text-muted-foreground">Nov 16, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-bold">85%</span>
                        </div>
                        <div>
                          <div className="text-sm">17/20 correct</div>
                          <div className="text-xs text-muted-foreground">Time: 12:45</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Limits Quiz</h3>
                      <div className="text-sm text-muted-foreground">Nov 14, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-bold">70%</span>
                        </div>
                        <div>
                          <div className="text-sm">14/20 correct</div>
                          <div className="text-xs text-muted-foreground">Time: 15:30</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Integration Quiz</h3>
                      <div className="text-sm text-muted-foreground">Nov 10, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-bold">65%</span>
                        </div>
                        <div>
                          <div className="text-sm">13/20 correct</div>
                          <div className="text-xs text-muted-foreground">Time: 18:22</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Performance charts will appear here as you take more quizzes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

