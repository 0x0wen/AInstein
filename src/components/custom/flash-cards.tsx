"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, ChevronLeft, ChevronRight, Shuffle, Edit, Trash2 } from "lucide-react"

interface FlashCardsProps {
  studyKitId: string
}

export function FlashCards({ studyKitId }: FlashCardsProps) {
  const [activeTab, setActiveTab] = useState("study")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Sample flashcard data
  const flashcards = [
    {
      id: "1",
      front: "What is a derivative?",
      back: "A derivative measures the rate at which a function is changing at a given point. It's the slope of the tangent line to the function at that point.",
    },
    {
      id: "2",
      front: "What is the derivative of sin(x)?",
      back: "The derivative of sin(x) is cos(x).",
    },
    {
      id: "3",
      front: "What is the chain rule?",
      back: "The chain rule is a formula for computing the derivative of a composite function. If f(x) = g(h(x)), then f'(x) = g'(h(x)) · h'(x).",
    },
  ]

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setFlipped(false)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setFlipped(false)
    }
  }

  const handleShuffle = () => {
    setCurrentCardIndex(Math.floor(Math.random() * flashcards.length))
    setFlipped(false)
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="study">Study Cards</TabsTrigger>
          <TabsTrigger value="create">Create Cards</TabsTrigger>
          <TabsTrigger value="manage">Manage Decks</TabsTrigger>
        </TabsList>

        <TabsContent value="study" className="mt-0">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl mb-8">
              <div
                className={`relative w-full aspect-[3/2] cursor-pointer perspective-1000 ${flipped ? "flipped" : ""}`}
                onClick={() => setFlipped(!flipped)}
              >
                <div
                  className={`absolute w-full h-full transition-all duration-500 transform ${flipped ? "rotate-y-180 invisible" : "rotate-y-0 visible"}`}
                >
                  <Card className="w-full h-full flex flex-col justify-center items-center p-8 text-center">
                    <CardContent className="flex items-center justify-center h-full">
                      <h3 className="text-2xl font-medium">{flashcards[currentCardIndex].front}</h3>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">Click to flip</CardFooter>
                  </Card>
                </div>
                <div
                  className={`absolute w-full h-full transition-all duration-500 transform ${flipped ? "rotate-y-0 visible" : "rotate-y-180 invisible"}`}
                >
                  <Card className="w-full h-full flex flex-col justify-center items-center p-8 text-center bg-primary/5">
                    <CardContent className="flex items-center justify-center h-full">
                      <p className="text-lg">{flashcards[currentCardIndex].back}</p>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">Click to flip back</CardFooter>
                  </Card>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button variant="outline" size="icon" onClick={handlePrevCard} disabled={currentCardIndex === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Card {currentCardIndex + 1} of {flashcards.length}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextCard}
                disabled={currentCardIndex === flashcards.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleShuffle}>
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
              <Button>Start Quiz</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Create Flash Cards</CardTitle>
              <CardDescription>Upload a document or paste text to automatically generate flash cards.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload Document</h3>
                  <p className="text-sm text-muted-foreground mb-4">Generate cards from your notes or textbooks</p>
                  <Button>Browse Files</Button>
                </div>

                <div className="border-2 border-gray-300 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-2">Paste Text</h3>
                  <textarea
                    className="w-full p-3 border rounded-md h-32 text-sm mb-4"
                    placeholder="Paste your notes or text here..."
                  />
                  <Button className="w-full">Generate Cards</Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Generation Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Card Type</label>
                    <select className="w-full p-2 border rounded-md mt-1">
                      <option>Question & Answer</option>
                      <option>Term & Definition</option>
                      <option>Problem & Solution</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Number of Cards</label>
                    <select className="w-full p-2 border rounded-md mt-1">
                      <option>10 cards</option>
                      <option>20 cards</option>
                      <option>30 cards</option>
                      <option>All possible</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Derivatives</CardTitle>
                <CardDescription>12 cards • Last studied 2 days ago</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between text-sm">
                  <span>Mastery:</span>
                  <span className="font-medium text-green-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Limits</CardTitle>
                <CardDescription>8 cards • Last studied yesterday</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between text-sm">
                  <span>Mastery:</span>
                  <span className="font-medium text-amber-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6 h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create New Deck</h3>
              <p className="text-sm text-muted-foreground mb-4">Add a new set of flash cards</p>
              <Button>Create Deck</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

