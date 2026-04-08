/**
 * @author 신희준
 *
 * @description NextAuth 설정
 */

import Credentials from 'next-auth/providers/credentials';
import NextAuth, { CredentialsSignin } from 'next-auth';
import type { LoginResponse, RefreshTokenResponse } from '@/types/auth';

// 상황별 분기 처리를 위한 커스텀 에러
class BadGatewayError extends CredentialsSignin {
  code = 'BAD_GATEWAY';
}

class ApiError extends CredentialsSignin {
  constructor(apiCode: string, data?: unknown) {
    super();
    this.code = JSON.stringify({ code: apiCode, data });
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, _request) {
        if (
          typeof credentials?.email !== 'string' ||
          typeof credentials?.password !== 'string'
        ) {
          return null;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/auth/password/admin/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        console.log('response', response);

        if (response.status === 502) {
          throw new BadGatewayError();
        }

        const data: LoginResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new ApiError(data.code ?? 'UNKNOWN', data.data);
        }

        const { token, requireChange } = data.data;
        if (!token || requireChange === null) {
          throw new ApiError(data.code ?? 'UNKNOWN', data.data);
        }

        return {
          id: credentials.email,
          email: credentials.email,
          accessToken: token.accessToken,
          accessTokenExpiresAt: token.accessTokenExpiresAt,
          refreshToken: token.refreshToken,
          refreshTokenExpiresAt: token.refreshTokenExpiresAt,
          requireChange,
        };
      },
    }),
    Credentials({
      id: 'face',
      credentials: {
        email: {},
        base64Image: {},
      },

      async authorize(credentials, _request) {
        if (
          typeof credentials?.email !== 'string' ||
          typeof credentials?.base64Image !== 'string'
        ) {
          return null;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/auth/face/admin/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              base64Image: credentials.base64Image,
            }),
          },
        );

        if (response.status === 502) {
          throw new BadGatewayError();
        }

        const data: LoginResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new ApiError(data.code ?? 'UNKNOWN', data.data);
        }

        const { token, requireChange } = data.data;
        if (!token || requireChange === null) {
          throw new ApiError(data.code ?? 'UNKNOWN', data.data);
        }

        return {
          id: credentials.email,
          email: credentials.email,
          accessToken: token.accessToken,
          accessTokenExpiresAt: token.accessTokenExpiresAt,
          refreshToken: token.refreshToken,
          refreshTokenExpiresAt: token.refreshTokenExpiresAt,
          requireChange,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 초기 로그인
      if (user) {
        const base64Payload = user.accessToken.split('.')[1];
        const decodedPayload = JSON.parse(
          Buffer.from(base64Payload, 'base64').toString(),
        );

        return {
          ...token,
          accessToken: user.accessToken,
          accessTokenExpiresAt: user.accessTokenExpiresAt,
          refreshToken: user.refreshToken,
          refreshTokenExpiresAt: user.refreshTokenExpiresAt,
          requireChange: user.requireChange,
          organizationId: decodedPayload.oid,
          accountId: decodedPayload.aid,
          profileType: decodedPayload.pt,
        };
      }

      if (trigger === 'update' && session?.requireChange !== undefined) {
        return {
          ...token,
          requireChange: session.requireChange,
        };
      }

      // accessToken 만료 확인
      const accessTokenExpires = new Date(
        token.accessTokenExpiresAt as string,
      ).getTime();

      if (Date.now() < accessTokenExpires) {
        return token;
      }

      // refreshToken 만료 확인
      const refreshTokenExpires = new Date(
        token.refreshTokenExpiresAt as string,
      ).getTime();

      if (Date.now() >= refreshTokenExpires) {
        return {
          ...token,
          error: 'RefreshTokenExpired',
        };
      }

      // refreshToken으로 accessToken 갱신
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/auth/refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
            }),
          },
        );

        const data: RefreshTokenResponse = await response.json();

        if (!response.ok || !data.success) {
          return {
            ...token,
            error: 'RefreshTokenError',
          };
        }

        const newToken = data.data.token;
        const refreshedAccessTokenExpires = new Date(
          newToken.accessTokenExpiresAt,
        ).getTime();

        if (
          Number.isNaN(refreshedAccessTokenExpires) ||
          Date.now() >= refreshedAccessTokenExpires
        ) {
          return {
            ...token,
            error: 'RefreshTokenError',
          };
        }

        const base64Payload = newToken.accessToken.split('.')[1];
        const decodedPayload = JSON.parse(
          Buffer.from(base64Payload, 'base64').toString(),
        );

        return {
          ...token,
          accessToken: newToken.accessToken,
          accessTokenExpiresAt: newToken.accessTokenExpiresAt,
          refreshToken: newToken.refreshToken,
          refreshTokenExpiresAt: newToken.refreshTokenExpiresAt,
          organizationId: decodedPayload.oid,
          accountId: decodedPayload.aid,
          profileType: decodedPayload.pt,
          requireChange: token.requireChange,
          error: undefined,
        };
      } catch (error) {
        console.error('[JWT] Token refresh exception:', error);
        return {
          ...token,
          error: 'RefreshTokenError',
        };
      }
    },

    async session({ session, token }) {
      if (token.error) {
        return {
          ...session,
          error: token.error,
        };
      }

      return {
        ...session,
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        organizationId: token.organizationId,
        accountId: token.accountId,
        profileType: token.profileType,
        requireChange: token.requireChange,
      };
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },
});
