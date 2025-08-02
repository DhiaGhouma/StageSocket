import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X } from 'lucide-react';

interface VoiceRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendVoiceMessage, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(20).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRecording) {
      // Timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Waveform animation
      const animateWaveform = () => {
        setWaveformBars(prev => prev.map(() => Math.random() * 100));
        animationRef.current = setTimeout(animateWaveform, 250);
      };
      animateWaveform();

      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = event => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.start();
      }).catch(err => {
        console.error("Microphone access denied or error: ", err);
        handleCancel();
      });

    } else {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onSendVoiceMessage(audioBlob, recordingTime);
        audioChunksRef.current = [];
      };
    }
    setIsRecording(false);
    setRecordingTime(0);
    setWaveformBars(Array(20).fill(0));
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
    setWaveformBars(Array(20).fill(0));
    onCancel();
  };

  if (!isRecording) {
    return (
      <button
        onClick={handleStartRecording}
        className="text-[#B0B3B8] hover:text-white transition-colors p-2 rounded-full hover:bg-[#2C2E3A]"
        title="Hold to record voice message"
      >
        <Mic className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3 bg-[#2C2E3A] rounded-full px-4 py-2 min-w-[280px]">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-red-400 text-sm font-medium">{formatTime(recordingTime)}</span>
      </div>

      <div className="flex items-center space-x-1 flex-1 justify-center">
        {waveformBars.map((height, index) => (
          <div
            key={index}
            className="bg-[#2D99A7] rounded-full transition-all duration-150 ease-out"
            style={{
              width: '3px',
              height: `${Math.max(4, height * 0.3)}px`,
              opacity: height > 50 ? 1 : 0.6,
            }}
          />
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleCancel}
          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/20"
          title="Cancel recording"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={handleStopRecording}
          className="bg-[#2D99A7] text-white p-2 rounded-full hover:bg-[#2D99A7]/80 transition-colors"
          title="Send voice message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
