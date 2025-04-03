import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  message: string;
  model?: string;
}

interface OllamaResponse {
  response: string;
}

export async function GET() {
  return NextResponse.json({ message: "Ollama API is running" });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { message, model } = body;

    if (!message) {
      return NextResponse.json(
        { error: "메시지가 필요합니다." },
        { status: 400 }
      );
    }

    // Ollama API 호출 (로컬에서 실행 중인 Ollama 서버에 연결)
    const ollamaApiUrl = process.env.OLLAMA_API_URL || "http://localhost:11434";

    console.log(`Connecting to Ollama API at: ${ollamaApiUrl}/api/generate`);

    const response = await fetch(`${ollamaApiUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "llama3.2",
        prompt: message,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      return NextResponse.json(
        { error: `Ollama API 오류: ${errorData.error || response.statusText}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as OllamaResponse;
    return NextResponse.json({
      response: data.response || "응답을 받지 못했습니다.",
    });
  } catch (error) {
    console.error("Ollama API 호출 중 오류 발생:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
