import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceMessageProps {
  fileName: string;
  duration: string; // e.g. "2s" or "0:02"
  audioUrl: string;
  isMe?: boolean; // To style differently for sender vs receiver
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ 
  duration, 
  audioUrl, 
  isMe = false 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Play / pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // Update progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  // Sync isPlaying state with audio element events
  useEffect(() => {
    if (!audioRef.current) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    const audio = audioRef.current;
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Voice Message Player */}
      <div 
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer select-none transition-all duration-200 hover:opacity-90 ${
          isMe 
            ? 'bg-white bg-opacity-10' 
            : 'bg-[#2D99A7] bg-opacity-20'
        }`}
        onClick={togglePlay}
      >
        {/* Play/Pause Button */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isMe 
            ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
            : 'bg-[#2D99A7] bg-opacity-30 hover:bg-opacity-40'
        }`}>
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </div>

        {/* Waveform Visualization */}
        <div className="flex-1 flex items-center space-x-1">
          <div className="flex items-center space-x-1 flex-1">
            {/* Animated waveform bars */}
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  isMe ? 'bg-white' : 'bg-[#2D99A7]'
                }`}
                style={{
                  width: '3px',
                  height: `${Math.random() * 20 + 8}px`,
                  opacity: isPlaying ? (Math.random() * 0.5 + 0.5) : 0.6,
                  transform: isPlaying ? `scaleY(${Math.random() * 0.5 + 0.8})` : 'scaleY(1)',
                }}
              />
            ))}
          </div>
          
          {/* Duration Display */}
          <div className="text-right">
            <p className="text-white text-xs font-medium">
              {isPlaying && totalDuration > 0 
                ? `${formatTime(currentTime)} / ${formatTime(totalDuration)}`
                : duration
              }
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="w-full bg-black bg-opacity-20 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ${
              isMe ? 'bg-white' : 'bg-[#2D99A7]'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        className="hidden"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default VoiceMessage;