import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Image, Tag } from "lucide-react"
import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute('/study-kit/create/')({
    component: CreateKitPage,
});

export default function CreateKitPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    color: "#1E88E5",
  })

  const colorOptions = [
    { name: "Blue", value: "#1E88E5" },
    { name: "Green", value: "#7CB342" },
    { name: "Amber", value: "#FFA000" },
    { name: "Red", value: "#E53935" },
    { name: "Purple", value: "#8E24AA" },
    { name: "Teal", value: "#00897B" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the study kit to a database
    console.log("Creating study kit:", formData)

    // Redirect to the new study kit page
    navigate({ to: "/study-kit/create"})
}

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Study Kit</h1>
        <p className="text-muted-foreground mt-1">Set up a new learning space for your subject or topic</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Study Kit Name
                </Label>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-l-md border border-r-0 border-input">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Calculus Fundamentals"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Briefly describe what you'll be learning in this Study Kit"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-base">
                  Subject or Topic
                </Label>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-l-md border border-r-0 border-input">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Mathematics, History, Programming"
                    value={formData.subject}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Color Theme</Label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                        formData.color === color.value ? "border-black dark:border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      title={color.name}
                    >
                      {formData.color === color.value && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Cover Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop an image, or click to browse</p>
                  <Button type="button" variant="outline">
                    Choose Image
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate({to: "/"})}>
            Cancel
          </Button>
          <Button type="submit">Create Study Kit</Button>
        </div>
      </form>
    </div>
  )
}

