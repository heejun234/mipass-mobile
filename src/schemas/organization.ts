/**
 * @author 신희준
 *
 * @description 조직 폼 Zod 스키마
 */

import z from 'zod';

const baseSchema = z.object({
  organizationType: z.string().min(1, '조직 구분을 선택하세요'),
  organizationName: z.string().min(1, '조직명을 입력하세요'),
  organizationDescription: z.string().optional(),
  isPublic: z.string().optional(),
  managerId: z.string().optional(),
  servicePlan: z.string().optional(),
  requireFace: z.string().optional(),
  verificationMethod: z.string().optional(),
  membershipDuration: z.string().optional(),
  invitationMethod: z.string().optional(),
});

export const organizationCreateSchema = baseSchema.extend({
  managerId: z.string().min(1, '마스터 회원을 선택하세요'),
});

export const organizationUpdateSchema = baseSchema;

export type OrganizationFormData = z.infer<typeof baseSchema>;
