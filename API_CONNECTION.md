# Ollama API 연결 설정 안내

이 문서는 Ollama API 연결 설정에 관한 안내입니다.

## 기본 연결 설정

기본적으로 애플리케이션은 `http://localhost:11434`에서 Ollama API 서버를 찾습니다. 이는 Ollama가 로컬 컴퓨터에서 기본 포트로 실행 중일 때 작동합니다.

## 환경 변수를 통한 연결 설정

다른 주소나 포트에서 Ollama API 서버에 연결하려면 `OLLAMA_API_URL` 환경 변수를 설정할 수 있습니다:

### Linux/Mac에서 설정
```bash
export OLLAMA_API_URL=http://your-ollama-server:11434
```

### Windows에서 설정
```bash
set OLLAMA_API_URL=http://your-ollama-server:11434
```

### .env 파일을 통한 설정
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가할 수 있습니다:
```
OLLAMA_API_URL=http://your-ollama-server:11434
```

## 연결 문제 해결

1. Ollama 서버가 실행 중인지 확인:
   ```bash
   curl http://localhost:11434/api/version
   ```

2. 방화벽 설정 확인:
   - 포트 11434가 열려 있는지 확인
   - 네트워크 인터페이스 설정 확인

3. Ollama 서버 로그 확인:
   ```bash
   # Ollama 서버 로그 확인
   ps aux | grep ollama
   ```

4. 다른 호스트에서 접근할 수 있도록 Ollama 설정:
   ```bash
   # 환경 변수 설정
   export OLLAMA_HOST=0.0.0.0:11434
   # Ollama 서버 실행
   ollama serve
   ```

## 개발 서버 실행 시 환경 변수 설정

개발 서버 실행 시 환경 변수를 함께 설정할 수 있습니다:

```bash
OLLAMA_API_URL=http://your-ollama-server:11434 npm run dev
```

또는 start.sh 스크립트를 수정하여 환경 변수를 설정할 수 있습니다.
