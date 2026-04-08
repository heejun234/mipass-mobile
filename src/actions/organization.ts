/**
 * @author 신희준
 *
 * @description 조직 관련 Server Actions
 *
 * @method GET /api/admin/organizations
 */

'use server';

import { AppError } from '@/lib/error';
import { authFetch } from '@/lib/fetch';
import { OrganizationFormData } from '@/schemas/organization';
import { ApiResponse, Asset, CommonSearchParams } from '@/types/common';
import {
  OrganizationDetailResponse,
  OrganizationListResponse,
} from '@/types/organization';

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * @author 신희준
 *
 * @description 조직 목록 조회
 *
 * @method GET /api/admin/organizations/{orgId}
 *
 */

export const getOrganizationList = async (searchParams: CommonSearchParams) => {
  const { page = '0', size = '10', keyword = '' } = searchParams;

  const params = new URLSearchParams({
    'paging.page': page,
    'paging.size': size,
  });

  if (keyword) {
    params.append('keyword', keyword);
  }

  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/organizations/list?${params.toString()}`,
  );
  const data: OrganizationListResponse = await response.json();

  if (!response.ok) {
    throw new AppError(data.message);
  }

  return data;
};

/**
 * @author 신희준
 *
 * @description 조직 상세 조회
 *
 * @method GET /api/admin/organizations/{orgId}
 *
 */

export const getOrganizationDetail = async (orgId: string) => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/organizations/${orgId}`,
  );
  const data: OrganizationDetailResponse = await response.json();

  if (!response.ok) {
    throw new AppError(data.message);
  }

  return data;
};

/**
 * @author 신희준
 *
 * @description 조직 등록
 *
 * @method POST /api/admin/organizations
 *
 */
export const postOrganization = async (
  formInput: OrganizationFormData,
  files: File[],
) => {
  const requestData = {
    ...formInput,
    isPublic: formInput.isPublic === 'true',
    requireFace: formInput.requireFace === 'true',
  };

  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify(requestData)], { type: 'application/json' }),
  );

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/organizations`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data: ApiResponse<void> = await response.json();

  if (!response.ok || !data.success) {
    return {
      success: false,
      message: data.message || '조직 등록에 실패했습니다',
      data: undefined,
    };
  }

  revalidatePath('/organization');
  revalidateTag('header-info');

  return data;
};

export const patchOrganization = async (
  formInput: OrganizationFormData,
  files: File[],
  orgId?: string,
  assets?: Asset[],
) => {
  const requestData = {
    ...formInput,
    isPublic: formInput.isPublic === 'true',
    requireFace: formInput.requireFace === 'true',
    ...(assets && { assets }), // assets가 있으면 추가
  };

  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify(requestData)], { type: 'application/json' }),
  );

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/organizations/${orgId}`,
    {
      method: 'PUT',
      body: formData,
    },
  );

  const data: ApiResponse<void> = await response.json();

  if (!response.ok || !data.success) {
    return {
      success: false,
      message: data.message || '조직 수정에 실패했습니다',
      data: undefined,
    };
  }

  revalidatePath('/organization');
  revalidateTag('header-info');

  return data;
};

export const deleteOrganization = async (orgId: string) => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/organizations/${orgId}`,
    {
      method: 'DELETE',
    },
  );

  const data: ApiResponse<void> = await response.json();

  if (!response.ok || !data.success) {
    return {
      success: false,
      message: data.message || '조직 삭제에 실패했습니다',
      data: undefined,
    };
  }

  revalidatePath('/organization');
  revalidateTag('header-info'); // ✅ Header의 조직 목록 갱신

  return data;
};

export const patchRestoreOrganization = async (orgId: string) => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/admin/organizations/${orgId}/restore`,
    {
      method: 'PATCH',
    },
  );

  const data: ApiResponse<void> = await response.json();

  if (!response.ok || !data.success) {
    return {
      success: false,
      message: data.message || '조직 복구에 실패했습니다',
      data: undefined,
    };
  }

  revalidatePath('/organization');

  return data;
};
