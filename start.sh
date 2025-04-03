#!/bin/bash

# Ollama AI 비서 실행 스크립트

# Ollama 서버가 실행 중인지 확인
echo "Ollama 서버 상태 확인 중..."
if ! curl -s http://localhost:11434/api/version > /dev/null; then
  echo "Ollama 서버가 실행되고 있지 않습니다."
  echo "Ollama 서버를 시작합니다..."
  ollama serve &
  sleep 3
  echo "Ollama 서버가 시작되었습니다."
else
  echo "Ollama 서버가 이미 실행 중입니다."
fi

# 설치된 모델 확인
echo "설치된 모델 확인 중..."
ollama list

# Next.js 개발 서버 시작
echo "AI 비서 웹 인터페이스를 시작합니다..."
cd "$(dirname "$0")"
npm run dev
