/**
 * 서버 컴포넌트에서 throw 시 프로덕션 환경에서도
 * error.digest를 통해 클라이언트 에러 바운더리에 메시지가 전달됩니다.
 */
export class AppError extends Error {
  digest: string;

  constructor(message: string) {
    super(message);
    this.name = 'AppError';
    this.digest = message;
  }
}
