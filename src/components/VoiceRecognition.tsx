'use client';

import { useState, useEffect } from 'react';

interface VoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
}

export default function VoiceRecognition({ onTranscript }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Web Speech API 지원 확인
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'ko-KR'; // 한국어 설정 (사용자 언어에 맞게 변경 가능)
        
        recognitionInstance.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
        };
        
        recognitionInstance.onend = () => {
          if (isListening) {
            recognitionInstance.start();
          }
        };
        
        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      if (transcript) {
        onTranscript(transcript);
        setTranscript('');
      }
    } else {
      recognition.start();
    }
    
    setIsListening(!isListening);
  };

  if (!isSupported) {
    return (
      <div className="text-red-500 mb-4">
        음성 인식 기능이 이 브라우저에서 지원되지 않습니다. Chrome 브라우저를 사용해 주세요.
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button
        onClick={toggleListening}
        className={`px-4 py-2 rounded-full ${
          isListening 
            ? 'bg-destructive hover:bg-destructive/90' 
            : 'bg-green-500 hover:bg-green-600'
        } text-white transition-colors flex items-center gap-2`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M8 1a2 2 0 0 1 2 2v4a2 2 0 1 1-4 0V3a2 2 0 0 1 2-2m0 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          <path d="M8 10a4 4 0 0 0 4-4V3a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4m0 1a5 5 0 0 1-5-5V3a5 5 0 0 1 10 0v3a5 5 0 0 1-5 5"/>
        </svg>
        {isListening ? '음성 인식 중지' : '음성으로 입력'}
      </button>
      
      {isListening && transcript && (
        <div className="mt-2 p-2 bg-gray-100 rounded-lg">
          <p className="font-medium">인식된 텍스트:</p>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
