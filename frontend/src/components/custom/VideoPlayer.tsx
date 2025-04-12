interface VideoPlayerProps {
  videoId: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="aspect-video bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-lg font-medium">Video Player</p>
          <p className="text-sm text-gray-400">Video ID: {videoId}</p>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-auto">
        <h3 className="text-xl font-bold mb-2">Integration Techniques</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Published on Nov 13, 2023
        </p>
        <div className="prose prose-sm">
          <p>This video covers essential integration techniques including:</p>
          <ul>
            <li>Basic integration formulas</li>
            <li>Integration by substitution</li>
            <li>Integration by parts</li>
            <li>Partial fractions</li>
            <li>Trigonometric substitution</li>
          </ul>
          <p>
            Understanding these techniques is crucial for solving complex
            integration problems and applications in calculus.
          </p>
        </div>
      </div>
    </div>
  );
}
