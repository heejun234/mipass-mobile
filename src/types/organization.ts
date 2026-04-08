/**
 * @author 신희준
 *
 * @description 파트너 관련 타입 정의
 */

import { ApiResponse, Pagination } from './common';

export interface OrganizationListItem {
  organizationId: string;
  organizationType: string;
  organizationName: string;
  organizationDescription: string;
  organizationIsPublic: boolean;
  organizationServicePlan: string;
  organizationStatus: string;
  requireFace: boolean;
  verificationMethod: string;
  membershipDuration: string;
  invitationMethod: string;
  parentOrganizationId: string | null;
  parentOrganizationName: string | null;
  managerId: string;
  managerName: string;
  managerEmail: string;
  createdAt: string;
}

export type OrganizationListResponse = ApiResponse<
  Pagination<OrganizationListItem>
>;

export interface OrganizationDetail {
  organizationId: string;
  organizationType: string;
  organizationName: string;
  organizationDescription: string;
  organizationIsPublic: boolean;
  organizationServicePlan: string;
  organizationStatus: string;
  requireFace: boolean;
  verificationMethod: string;
  membershipDuration: string;
  invitationMethod: string;
  parentOrganizationId: string | null;
  parentOrganizationName: string | null;
  managerId: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  createdAt: string;
  assets: {
    assetId: string;
    category: string;
    originalName: string;
  }[];
}

export type OrganizationDetailResponse = ApiResponse<OrganizationDetail>;

/**
 * @author 신희준
 * @description 조직 관련 타입 정의
 */

export type Member = {
  accountId: string;
  accountName: string;
  accountEmail: string;
  accountPhone?: string;
  accountPhoneCountryCode?: string;
};

export type MemberSearchItem = {
  content: Member[];
  hasNext: boolean;
  page: number;
  size: number;
};

export type MemberSearchResponse = ApiResponse<MemberSearchItem>;
