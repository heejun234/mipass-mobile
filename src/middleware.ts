/**
 * @author 신희준
 *
 * @description 인증 미들웨어
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const AUTH_COOKIES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'authjs.callback-url',
  '__Secure-authjs.callback-url',
  'authjs.csrf-token',
  '__Host-authjs.csrf-token',
];

const clearAuthCookies = (response: NextResponse) => {
  AUTH_COOKIES.forEach((name) => {
    response.cookies.set(name, '', { maxAge: 0, path: '/' });
  });
  return response;
};

const isValidCallbackUrl = (url: string, baseUrl: string) => {
  try {
    const parsed = url.startsWith('/') ? new URL(url, baseUrl) : new URL(url);
    return parsed.href.startsWith(baseUrl);
  } catch {
    return false;
  }
};

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public 경로 (인증 불필요)
  const publicPaths = [
    '/redirect',
    '/app-download',
    '/login',
    '/select-organization',
    '/api/auth',
    '/initchangepw',
    '/terms-agree',
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // callbackUrl 쿠키가 유효하지 않으면 모든 auth 쿠키 초기화 후 로그인으로 (public 경로 제외)
  if (!isPublicPath) {
    const callbackUrlCookie =
      req.cookies.get('authjs.callback-url')?.value ??
      req.cookies.get('__Secure-authjs.callback-url')?.value;
    if (
      callbackUrlCookie &&
      !isValidCallbackUrl(callbackUrlCookie, req.nextUrl.origin)
    ) {
      const loginUrl = new URL('/login', req.url);
      return clearAuthCookies(NextResponse.redirect(loginUrl));
    }
  }

  // 로그인된 사용자가 login 페이지 접근 시
  /*  if (pathname.startsWith('/login') && req.auth) {
    // 세션 에러가 있으면 쿠키 삭제하고 로그인 페이지에 머물기
    if (req.auth.error) {
      return clearAuthCookies(NextResponse.next());
    }

    // 정상 세션이 있으면 프로필 타입에 따라 리다이렉트
    const profileType = req.auth.profileType;
    const organizationId = req.auth.organizationId;

    if (
      (profileType === 'SUPER_ADMIN' || profileType === 'PARTNER') &&
      organizationId
    ) {
      const dashboardUrl = new URL(`/${organizationId}/dashboard`, req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    const selectOrgUrl = new URL('/select-organization', req.url);
    return NextResponse.redirect(selectOrgUrl);
  } */

  // 로그인된 사용자가 select-organization 페이지 접근 시 프로필 타입에 따라 리다이렉트

  if (pathname.startsWith('/select-organization') && req.auth) {
    const profileType = req.auth.profileType;
    const organizationId = req.auth.organizationId;

    if (
      (profileType === 'SUPER_ADMIN' || profileType === 'PARTNER') &&
      organizationId
    ) {
      const dashboardUrl = new URL(`/${organizationId}/dashboard`, req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Public 경로는 인증 체크 안함
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 인증이 필요한 페이지
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 토큰 에러가 있으면 세션 쿠키 삭제하고 로그인 페이지로 리다이렉트
  if (req.auth.error) {
    const loginUrl = new URL('/login', req.url);

    if (req.auth.error === 'RefreshTokenExpired') {
      loginUrl.searchParams.set('error', 'session_expired');
    } else if (req.auth.error === 'RefreshTokenError') {
      loginUrl.searchParams.set('error', 'refresh_failed');
    }

    return clearAuthCookies(NextResponse.redirect(loginUrl));
  }

  // requireChange가 true인 경우 protectedRoutes 접근 시 비밀번호 변경 페이지로 리다이렉트
  /*  if (req.auth?.requireChange === true && !pathname.startsWith('/initchangepw')) {
    const protectedRoutes = ['dashboard', 'organization', 'user', 'auth-history', 'equipment', 'partner', 'membership', 'myinfo'];

    // protectedRoutes 중 하나에 접근하는지 체크
    // /[organizationId]/dashboard 같은 패턴도 체크
    const pathSegments = pathname.split('/').filter(Boolean);
    const isProtectedRoute = protectedRoutes.some((route) => {
      // pathSegments에 route가 포함되어 있으면 protected route
      return pathSegments.includes(route);
    });

    if (isProtectedRoute) {
      const initChangePwUrl = new URL('/initchangepw', req.url);
      return NextResponse.redirect(initChangePwUrl);
    }
  } */

  // organizationId 없이 보호된 경로 접근 체크
  // 정확히 /dashboard, /organization 등으로 시작하는 경우만 체크 (하위 경로 제외)
  const protectedRoutes = [
    '/dashboard',
    '/organization',
    '/user',
    '/auth-history',
    '/equipment',
    '/partner',
    '/membership',
    '/myinfo',
  ];

  // 정확한 매칭: /dashboard로 시작하지만 /[organizationId]/dashboard 형태가 아닌 경우
  const isInvalidProtectedRoute = protectedRoutes.some((route) => {
    // /dashboard, /dashboard/xxx 등으로 시작하는지 체크
    if (!pathname.startsWith(route)) return false;

    // /[organizationId]/dashboard 형태인지 체크
    const pathSegments = pathname.split('/').filter(Boolean);
    // 첫 번째 세그먼트가 보호된 경로 이름이면 잘못된 접근
    return pathSegments[0] === route.slice(1);
  });

  // organizationId 없이 보호된 경로에 접근하면 로그아웃 후 로그인 페이지로
  if (isInvalidProtectedRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', 'invalid_path');
    return clearAuthCookies(NextResponse.redirect(loginUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
