/**
 * @author 신희준
 *
 * @description NextAuth 타입 정의
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    requireChange: boolean;
  }

  interface Session {
    accessToken?: string;
    accessTokenExpiresAt?: string;
    refreshToken?: string;
    refreshTokenExpiresAt?: string;
    organizationId?: string;
    accountId?: string;
    profileType?: string;
    requireChange?: boolean;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    accessTokenExpiresAt?: string;
    refreshToken?: string;
    refreshTokenExpiresAt?: string;
    organizationId?: string;
    accountId?: string;
    profileType?: string;
    requireChange?: boolean;
    error?: string;
  }
}
