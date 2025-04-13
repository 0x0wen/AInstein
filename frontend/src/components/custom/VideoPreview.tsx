import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPreviewProps {
  videoId: string;
  onExpandClick: () => void;
}

export function VideoPreview({ videoId, onExpandClick }: VideoPreviewProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/video/${videoId}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
        } else {
          throw new Error('Video URL not available');
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideoData();
  }, [videoId]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Handle play/pause events from the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center text-destructive">
        <div className="text-center p-4">
          <p className="font-medium">Failed to load video</p>
          <p className="text-xs mt-1">{error}</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={onExpandClick}>
            Try in Full View
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className="h-full w-full object-contain cursor-pointer"
        src={videoUrl || undefined}
        onClick={togglePlayPause}
        preload="metadata"
      />
      
      {/* Play/Pause Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${
          isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
        }`}
        onClick={togglePlayPause}
      >
        <div className="bg-black/60 rounded-full p-3">
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white" />
          )}
        </div>
      </div>
      
      {/* Expand Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onExpandClick();
        }}
        title="Expand video"
      >
        <Maximize size={16} />
      </Button>
    </>
  );
}