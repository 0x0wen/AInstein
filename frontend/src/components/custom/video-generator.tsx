import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  Play,
  Download,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface VideoGeneratorProps {
  studyKitId: string;
}

export function VideoGenerator({ studyKitId }: VideoGeneratorProps) {
  const [activeTab, setActiveTab] = useState('create');

  // Sample video data
  const videos = [
    {
      id: '1',
      title: 'Understanding Derivatives',
      thumbnail: '/placeholder.svg?height=180&width=320',
      duration: '5:32',
      date: 'Nov 15, 2023',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Limits Explained',
      thumbnail: '/placeholder.svg?height=180&width=320',
      duration: '4:18',
      date: 'Nov 14, 2023',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Integration Techniques',
      thumbnail: '/placeholder.svg?height=180&width=320',
      duration: '7:45',
      date: 'Nov 16, 2023',
      status: 'processing',
    },
  ];

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create">Create New Video</TabsTrigger>
          <TabsTrigger value="library">Video Library</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Generate Explanatory Video</CardTitle>
              <CardDescription>
                Upload a problem or concept you'd like explained, and AInstein
                will create a video explanation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Upload Files</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Supports PDF, DOCX, JPG, PNG (Max 10MB)
                </p>
                <Button>Browse Files</Button>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">
                  Additional Notes (Optional)
                </h3>
                <textarea
                  className="w-full p-3 border rounded-md h-24 text-sm"
                  placeholder="Add any specific instructions or areas you'd like the video to focus on..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Generate Video</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail || '/placeholder.svg'}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  {video.status === 'processing' && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Processing</span>
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{video.title}</CardTitle>
                  <CardDescription>{video.date}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {video.status === 'completed' ? (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-amber-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>Processing</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
