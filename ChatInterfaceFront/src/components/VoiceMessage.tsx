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
  const [waveformBars, setWaveformBars] = useState<number[]>(
    Array.from({ length: 12 }, () => Math.random() * 20 + 8)
  );
  const animationRef = useRef<number | null>(null);

  // Play / pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // Animate waveform bars when playing
  const animateWaveform = () => {
    if (isPlaying) {
      setWaveformBars(prev => 
        prev.map(() => Math.random() * 20 + 8)
      );
      animationRef.current = requestAnimationFrame(() => {
        setTimeout(animateWaveform, 150);
      });
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

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setTotalDuration(audio.duration);
    };

    const handleCanPlayThrough = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Start/stop waveform animation based on playing state
  useEffect(() => {
    if (isPlaying) {
      animateWaveform();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Reset to static bars
      setWaveformBars(Array.from({ length: 12 }, () => Math.random() * 20 + 8));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="space-y-2">
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
            : 'bg-[#2D99A7] bg-opacity-50 hover:bg-opacity-70'
        }`}>
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </div>

        {/* Waveform Visualization */}
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center space-x-1 flex-1 justify-center">
            {/* Animated waveform bars */}
            {waveformBars.map((height, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-150 ease-out ${
                  isMe ? 'bg-white' : 'bg-[#2D99A7]'
                }`}
                style={{
                  width: '3px',
                  height: `${height}px`,
                  opacity: isPlaying ? 0.8 : 0.6,
                }}
              />
            ))}
          </div>
          
          {/* Duration Display */}
          <div className="text-right ml-3">
            <p className="text-white text-xs font-medium min-w-[45px]">
              {totalDuration > 0 
                ? `${formatTime(currentTime)} / ${formatTime(totalDuration)}`
                : duration
              }
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar - Always visible when audio is loaded */}
      {totalDuration > 0 && (
        <div className="w-full bg-black bg-opacity-30 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-out ${
              isMe ? 'bg-white bg-opacity-80' : 'bg-[#2D99A7]'
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
        crossOrigin="anonymous"
        className="hidden"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default VoiceMessage;