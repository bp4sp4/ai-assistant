"use client";

import { useState, useRef, useEffect } from "react";
import VoiceRecognition from "./VoiceRecognition";
import ImageGeneration from "./ImageGeneration";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("llama3.2");
  const [showImageGen, setShowImageGen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText, model }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API 요청 실패 (${response.status})`
        );
      }

      const data = await response.json();
      if (!data.response) {
        throw new Error("응답 데이터가 없습니다.");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "오류가 발생했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    sendMessage(transcript);
  };

  const handleImageGenerated = (imageUrl: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "이미지가 생성되었습니다:",
        imageUrl: imageUrl,
      },
    ]);
    setShowImageGen(false);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto p-4 bg-secondary rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex-1">
          <label
            htmlFor="model-select"
            className="block text-sm font-medium mb-1"
          >
            모델 선택:
          </label>
          <select
            id="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="llama3.2">Llama 3.2</option>
            <option value="llava">Llava</option>
            <option value="deepseek-r1">DeepSeek R1</option>
            <option value="qwq">QWQ</option>
          </select>
        </div>
        <button
          onClick={() => setShowImageGen(!showImageGen)}
          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showImageGen ? "이미지 생성 닫기" : "이미지 생성"}
        </button>
      </div>

      {showImageGen && (
        <ImageGeneration onImageGenerated={handleImageGenerated} />
      )}

      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-background rounded-lg border">
        {messages.length === 0 ? (
          <div className="text-center my-8">
            <p>안녕하세요! 저는 Ollama 기반 AI 비서입니다.</p>
            <p>무엇을 도와드릴까요?</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 ml-auto max-w-[80%]"
                  : "bg-muted mr-auto max-w-[80%]"
              }`}
            >
              <div className="font-semibold mb-1">
                {msg.role === "user" ? "사용자" : "AI 비서"}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.imageUrl && (
                <div className="mt-2">
                  <img
                    src={msg.imageUrl}
                    alt="생성된 이미지"
                    className="max-w-full rounded-lg border"
                  />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <VoiceRecognition onTranscript={handleVoiceTranscript} />

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-3 border rounded-lg bg-background"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "처리 중..." : "전송"}
        </button>
      </form>
    </div>
  );
}
