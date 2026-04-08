/**
 * @author 신희준
 *
 * @description 인증 관련 타입 정의
 */

export interface LoginResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    token: {
      accessToken: string;
      accessTokenExpiresAt: string;
      refreshToken: string;
      refreshTokenExpiresAt: string;
    } | null;
    requireChange: boolean | null;
    requiredConsents?: {
      code: string;
      title: string;
      required: boolean;
      reConsent: boolean;
      assets: {
        assetId: string;
        category: string;
        originalName: string;
        previewUrl: string;
      }[];
    }[];
    faceRegistered?: boolean;
  };
  remainingLockTime: { hours: number; minutes: number; seconds: number };
}

export interface RefreshTokenResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    token: {
      accessToken: string;
      accessTokenExpiresAt: string;
      refreshToken: string;
      refreshTokenExpiresAt: string;
    };
    requireChange: boolean | null;
    remainingLockTime: { hours: number; minutes: number; seconds: number } | null;
  };
}
