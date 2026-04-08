/**
 * @author 신희준
 *
 * @description 공통 타입 정의
 */

// API 응답 공통 구조
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code?: string;
  data: T;
}

// 페이지네이션 정보
export interface Pagination<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 공통 페이지네이션 파라미터
export interface CommonSearchParams {
  page?: string;
  size?: string;
  keyword?: string;
}

export interface Asset {
  existingAssetId: string;
  delete: boolean;
}

export interface ExistingAsset {
  assetId: string;
  originalName: string;
  delete: boolean;
}

export interface HeaderInfo {
  account: {
    accountId: string;
    name: string;
    email: string;
    type: string;
  };
  organizations: {
    organizationId: string;
    name: string;
  }[];
  unreadNotificationCount: number;
}

export type HeaderInfoResponse = ApiResponse<HeaderInfo>;

export type Notice = {
  publicId: string;
  category: 'string';
  type: string;
  message: string;
  viewCode: string;
  parameters: string;
  externalUrl: string;
  read: boolean;
  readAt: string;
  createdAt: string;
};

export type NoticeList = {
  content: Notice[];
  hasNext: boolean;
  page: number;
  size: number;
};

export type NoticeListResponse = ApiResponse<NoticeList>;

export interface TableCheckState {
  isTableCheck: boolean;
  setIsTableCheck: (isTableCheck: boolean) => void;
}

export interface TableCheckListState {
  tableCheckList: { membershipId: string; accountName: string }[];
  setTableCheckList: (
    tableCheckList: { membershipId: string; accountName: string }[],
  ) => void;
}
