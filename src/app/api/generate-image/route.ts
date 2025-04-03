import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: '이미지 생성을 위한 프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    // Ollama API 호출 (로컬에서 실행 중인 Ollama 서버에 연결)
    // 환경 변수에서 Ollama API URL을 가져오거나 기본값 사용
    const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    
    console.log(`Connecting to Ollama API at: ${ollamaApiUrl}/api/generate`);
    
    const response = await fetch(`${ollamaApiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llava', // 이미지 생성 가능한 모델 (사용자 환경에 맞게 변경 필요)
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Ollama API 오류: ${errorData.error || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 이미지 URL 반환 (실제 구현에서는 Base64 인코딩된 이미지 데이터를 반환할 수 있음)
    return NextResponse.json({ 
      imageUrl: data.image || '/placeholder-image.png',
      message: '이미지가 성공적으로 생성되었습니다.' 
    });
  } catch (error) {
    console.error('이미지 생성 API 호출 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
