'use client';

import { useState } from 'react';

interface ImageGenerationProps {
  onImageGenerated: (imageUrl: string) => void;
}

export default function ImageGeneration({ onImageGenerated }: ImageGenerationProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('이미지 생성을 위한 프롬프트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 생성에 실패했습니다.');
      }

      const data = await response.json();
      onImageGenerated(data.imageUrl);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || '이미지 생성 중 오류가 발생했습니다.');
      console.error('이미지 생성 오류:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-4 p-4 bg-secondary rounded-lg border">
      <h3 className="text-lg font-medium mb-2">이미지 생성</h3>
      
      <div className="mb-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="이미지 생성을 위한 프롬프트를 입력하세요..."
          className="w-full p-3 border rounded-lg resize-none bg-background"
          rows={3}
          disabled={isGenerating}
        />
      </div>
      
      {error && <div className="text-destructive mb-3">{error}</div>}
      
      <button
        onClick={generateImage}
        disabled={isGenerating || !prompt.trim()}
        className={`px-4 py-2 rounded-lg ${
          isGenerating || !prompt.trim()
            ? 'bg-muted cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white transition-colors`}
      >
        {isGenerating ? '이미지 생성 중...' : '이미지 생성하기'}
      </button>
    </div>
  );
}
