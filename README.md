# Ollama AI Assistant

Ollama AI Assistant는 Ollama를 사용한 대화형 AI 비서 웹 애플리케이션입니다.

## 기능

- 대화형 AI 채팅
- 음성 인식 지원
- 이미지 생성 기능
- 다양한 AI 모델 지원 (llama3.2, llava, deepseek-r1, qwq)

## 배포 방법

1. Vercel에 프로젝트를 배포합니다.
2. 환경 변수 설정:
   - `OLLAMA_API_URL`: Ollama 서버 URL

## 로컬 개발 환경 설정

1. 저장소를 클론합니다:

   ```bash
   git clone [repository-url]
   ```

2. 의존성을 설치합니다:

   ```bash
   npm install
   ```

3. Ollama 서버를 시작합니다:

   ```bash
   ./start.sh
   ```

4. 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- Ollama API
