/**
 * @author 신희준
 *
 * @description 인증(token) fetch 유틸리티
 */

import { auth } from '@/auth';
import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authFetch(url: string, options?: RequestInit) {
  const session = await auth();

  // 세션 에러 체크 (리프레시 토큰 만료/에러)
  if (session?.error) {
    // 세션 쿠키는 middleware에서 삭제되므로 여기서는 리다이렉트만
    redirect('/login?error=session_expired');
  }

  if (!session?.accessToken) {
    redirect('/login?error=no_token');
  }

  // body가 string이면 JSON으로 간주하고 Content-Type 자동 설정
  const isJsonBody = options?.body && typeof options.body === 'string';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  // 기존 헤더가 있으면 복사
  if (options?.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // JSON body이고 Content-Type이 없으면 자동 추가
  if (isJsonBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

export async function clientAuthFetch(session: Session | null, url: string, options?: RequestInit) {
  if (session?.error) {
    throw new Error('Session expired. Please login again.');
  }

  if (!session?.accessToken) {
    throw new Error('No access token available');
  }

  const isJsonBody = options?.body && typeof options.body === 'string';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (options?.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  if (isJsonBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
