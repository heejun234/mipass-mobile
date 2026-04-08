'use server';

import { AppError } from '@/lib/error';
import { authFetch } from '@/lib/fetch';
import {
  ApiResponse,
  CommonSearchParams,
  HeaderInfoResponse,
  NoticeListResponse,
} from '@/types/common';
import { revalidateTag } from 'next/cache';

/**
 * @author 신희준
 *
 * @description 헤더 정보 조회
 *
 * @method GET /api/header
 */

export const getHeaderInfo = async () => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/header`,
  );
  const data: HeaderInfoResponse = await response.json();

  if (!response.ok) {
    throw new AppError(data.message);
  }

  return data;
};

/**
 *
 * @author 신희준
 *
 * @description 알림 목록 조회
 *
 * @method GET /api/notification
 *
 * @param searchParams - 검색 파라미터
 */

export const getNoticeList = async (searchParams: CommonSearchParams) => {
  const { page = '0', size = '10', keyword = '' } = searchParams;

  const params = new URLSearchParams({
    'paging.page': page,
    'paging.size': size,
  });

  if (keyword) {
    params.append('keyword', keyword);
  }

  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/notification?${params.toString()}`,
    {
      next: { tags: ['notice-list'] },
    },
  );
  const data: NoticeListResponse = await response.json();

  if (!response.ok) {
    throw new AppError(data.message);
  }

  return data;
};

export const patchNoticeRead = async (noticeId: string) => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/notification/${noticeId}/read`,
    {
      method: 'PATCH',
    },
  );

  const data: ApiResponse<void> = await response.json();

  if (!response.ok || !data.success) {
    throw new AppError(data.message || '읽음 처리에 실패했습니다');
  }

  revalidateTag('notice-list');

  return data;
};

export const patchNoticeReadAll = async () => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/notification/read-all`,
    {
      method: 'PATCH',
    },
  );

  const data: ApiResponse<void> = await response.json();

  if (!response.ok || !data.success) {
    throw new AppError(data.message || '읽음 처리에 실패했습니다');
  }

  revalidateTag('notice-list');

  return data;
};

export const deleteNotice = async (noticeId: string) => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/notification/${noticeId}`,
    {
      method: 'DELETE',
      /*  body: JSON.stringify({ notificationIds: noticeId }), */
    },
  );

  const data: ApiResponse<void> = await response.json();

  if (!response.ok || !data.success) {
    throw new AppError(data.message || '삭제 처리에 실패했습니다');
  }

  revalidateTag('notice-list');

  return data;
};

export const getAssetPreview = async (assetId: string) => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/asset/${assetId}/preview`,
  );
  const data: ApiResponse<string> = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message,
      data: null,
    };
  }

  return data;
};
