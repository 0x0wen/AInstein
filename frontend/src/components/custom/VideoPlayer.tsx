import React, { useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
}

interface VideoData {
  title: string;
  videoUrl: string;
  createdAt: string;
  _id: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3000/api/video/${videoId}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.status}`);
        }
        
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  // Format publication date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-destructive">
          <p className="font-medium">Failed to load video</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {videoData?.videoUrl ? (
        <video 
          className="aspect-video bg-black w-full" 
          controls 
          autoPlay
          src={videoData.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="aspect-video bg-black flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-lg font-medium">Video Player</p>
            <p className="text-sm text-gray-400">Video ID: {videoId}</p>
            <p className="text-sm text-gray-500 mt-2">Video URL not available</p>
          </div>
        </div>
      )}
      
      <div className="p-4 flex-1 overflow-auto">
        <h3 className="text-xl font-bold mb-2">{videoData?.title || 'Video Title'}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Published on {videoData ? formatDate(videoData.createdAt) : 'Unknown date'}
        </p>
      </div>
    </div>
  );
}