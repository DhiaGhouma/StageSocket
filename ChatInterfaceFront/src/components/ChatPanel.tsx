import React, { useState } from 'react';
import { 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Mic, 
  Send,
  X,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import VoiceMessage from './VoiceMessage';

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'file';
  fileName?: string;
  fileSize?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileType?: string;
  chatId: string;
  senderName?: string;
}

const randomName = 'User_' + Math.floor(Math.random() * 10000);
const currentUser: User = {
  id: crypto.randomUUID(),
  name: randomName,
  initials: randomName.charAt(5), // Grab number from 'User_1234'
};

const VoiceRecorder = ({
  onSendVoiceMessage,
  onCancel,
}: {
  onSendVoiceMessage: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(20).fill(0));
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const intervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
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

const FileUpload = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'application/pdf' // .pdf
      ];
      
      const allowedExtensions = ['.xlsx', '.xls', '.docx', '.doc', '.pdf'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        onFileSelect(file);
      } else {
        alert('Please select only Excel (.xlsx, .xls), Word (.docx, .doc), or PDF files.');
      }
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.docx,.doc,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-[#B0B3B8] hover:text-white transition-colors"
        title="Upload file (Excel, Word, PDF)"
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </>
  );
};

const FileMessage = ({ fileName, fileSize, fileType, fileUrl }: { 
  fileName: string; 
  fileSize: string; 
  fileType: string;
  fileUrl?: string;
}) => {
  const getFileIcon = (type: string) => {
    if (type.includes('excel') || type.includes('spreadsheet')) {
      return '📊';
    } else if (type.includes('word') || type.includes('document')) {
      return '📄';
    } else if (type.includes('pdf')) {
      return '📋';
    }
    return '📎';
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-[#1A1C24] rounded-lg border border-[#2C2E3A] max-w-[300px]">
      <div className="w-10 h-10 bg-[#2C2E3A] rounded-lg flex items-center justify-center">
        <span className="text-xl">{getFileIcon(fileType)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{fileName}</p>
        <p className="text-xs text-[#B0B3B8]">{fileSize}</p>
      </div>
      {fileUrl && (
        <button
          onClick={handleDownload}
          className="text-[#2D99A7] hover:text-[#2D99A7]/80 transition-colors p-1 rounded"
          title="Download file"
        >
          <Download className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [socket] = useState<Socket>(() => io('http://localhost:3001', {
    query: {
      username: randomName,
      userId: currentUser.id
    }
  }));

  const chatId = 'default-chat';

  React.useEffect(() => {
    socket.emit('join-chat', chatId);

    const handleReceiveMessage = (messageData: Message) => {
      setMessages((prev) => [...prev, {
        ...messageData,
        timestamp: new Date(messageData.timestamp)
      }]);
    };

    const handleMessageSent = (messageData: Message) => {
      console.log('Message sent successfully:', messageData);
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('message-sent', handleMessageSent);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('message-sent', handleMessageSent);
    };
  }, [socket]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendTextMessage = () => {
    if (!textInput.trim()) return;

    const message: Message = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      content: textInput.trim(),
      timestamp: new Date(),
      type: 'text',
      chatId,
      senderName: currentUser.name,
    };

    setMessages((prev) => [...prev, message]);
    socket.emit('send-message', message);
    setTextInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      console.log('Uploading file:', file.name, file.type, file.size);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);
      formData.append('senderId', currentUser.id);

      console.log('Sending request to: http://localhost:3001/chat/upload-file');

      // Upload file to server
      const uploadResponse = await fetch('http://localhost:3001/chat/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { fileUrl, fileName, fileSize, fileType } = await uploadResponse.json();

      // Create file message
      const message: Message = {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        content: `Shared a file: ${fileName}`,
        timestamp: new Date(),
        type: 'file',
        fileName: fileName || file.name,
        fileSize: fileSize || formatFileSize(file.size),
        fileType: fileType || file.type,
        fileUrl,
        chatId,
        senderName: currentUser.name,
      };

      setMessages((prev) => [...prev, message]);
      socket.emit('send-message', message);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendVoiceMessage = async (audioBlob: Blob, duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = (duration % 60).toString().padStart(2, '0');
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const uploadResponse = await fetch('http://localhost:3001/chat/upload-audio', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload audio');
      }
      
      const { audioUrl } = await uploadResponse.json();
      
      const message: Message = {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        content: `Voice message (${minutes}:${seconds})`,
        timestamp: new Date(),
        type: 'voice',
        fileName: `audio-${Date.now()}.webm`,
        fileSize: `${duration}s`,
        audioUrl,
        chatId,
        senderName: currentUser.name,
      };

      setMessages((prev) => [...prev, message]);
      socket.emit('send-message', message);
      setShowVoiceRecorder(false);
    } catch (error) {
      console.error('Error uploading voice message:', error);
      alert('Failed to send voice message');
    }
  };

  const handleCancelVoiceRecording = () => {
    setShowVoiceRecorder(false);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = (msg: Message) => {
    const isMe = msg.senderId === currentUser.id;
    
    return (
      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
         {!isMe && (
          <p className="text-[#B0B3B8] text-xs mb-1 ml-1">{msg.senderName || 'Anonymous'}</p>
         )}

          <div className={`rounded-lg px-4 py-2 ${
            isMe 
              ? 'bg-[#2D99A7] text-white' 
              : 'bg-[#2C2E3A] text-white'
          }`}>
            {msg.type === 'text' && (
              <p className="text-sm">{msg.content}</p>
            )}
            
            {msg.type === 'voice' && msg.audioUrl && (
              <VoiceMessage
                fileName={msg.fileName || 'Voice message'}
                duration={msg.fileSize || ''}
                audioUrl={msg.audioUrl}
              />
            )}

            {msg.type === 'file' && (
              <FileMessage
                fileName={msg.fileName || 'Unknown file'}
                fileSize={msg.fileSize || ''}
                fileType={msg.fileType || ''}
                fileUrl={msg.fileUrl}
              />
            )}
          </div>
          
          <p className={`text-[#B0B3B8] text-xs mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
            {formatTime(msg.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#121318] flex flex-col">
      {/* Chat Header */}
      <div className="bg-[#1A1C24] p-4 border-b border-[#2C2E3A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#2D99A7] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {currentUser.initials}
              </span>
            </div>
            <div>
              <h2 className="text-white font-semibold">Chat with {currentUser.name}</h2>
              <div className="flex items-center space-x-2">
                <p className="text-[#B0B3B8] text-sm">1 Member</p>
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-[#2D99A7] rounded-full border-2 border-[#1A1C24] flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {currentUser.initials}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="text-[#B0B3B8] hover:text-white transition-colors" title="Phone call">
              <Phone className="w-5 h-5" />
            </button>
            <button className="text-[#B0B3B8] hover:text-white transition-colors" title="Video call">
              <Video className="w-5 h-5" />
            </button>
            <button className="text-[#B0B3B8] hover:text-white transition-colors" title="More options">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2C2E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#B0B3B8] text-2xl">💬</span>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-[#B0B3B8]">Start a conversation by typing a message or uploading a file</p>
            </div>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
      </div>

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="bg-[#1A1C24] px-4 py-2 border-t border-[#2C2E3A]">
          <div className="flex items-center space-x-3">
            <Upload className="w-4 h-4 text-[#2D99A7] animate-pulse" />
            <span className="text-[#B0B3B8] text-sm">Uploading file...</span>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="bg-[#1A1C24] p-4 border-t border-[#2C2E3A]">
        <div className="flex items-center space-x-3">
          <FileUpload onFileSelect={handleFileUpload} />
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-[#2C2E3A] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D99A7] pr-12"
              disabled={showVoiceRecorder || isUploading}
            />
          </div>
          
          {showVoiceRecorder ? (
            <VoiceRecorder
              onSendVoiceMessage={handleSendVoiceMessage}
              onCancel={handleCancelVoiceRecording}
            />
          ) : (
            <button 
              onClick={() => setShowVoiceRecorder(true)}
              className="text-[#B0B3B8] hover:text-white transition-colors"
              title="Record voice message"
              disabled={isUploading}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={handleSendTextMessage}
            className={`p-2 rounded-lg transition-colors ${
              showVoiceRecorder || isUploading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-[#2D99A7] text-white hover:bg-[#2D99A7]/80'
            }`}
            disabled={showVoiceRecorder || isUploading}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;