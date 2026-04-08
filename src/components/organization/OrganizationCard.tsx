import type { OrganizationListItem } from '@/types/organization';

interface Props {
  item: OrganizationListItem;
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '정상',
  INACTIVE: '비활성',
  SUSPENDED: '정지',
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'text-green-600',
  INACTIVE: 'text-neutral-400',
  SUSPENDED: 'text-red-500',
};

const OrganizationCard = ({ item }: Props) => {
  const statusLabel =
    STATUS_LABEL[item.organizationStatus] ?? item.organizationStatus;
  const statusColor =
    STATUS_COLOR[item.organizationStatus] ?? 'text-neutral-500';

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '-';

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-4'>
      {/* 조직명 + 상태 */}
      <div className='flex items-center justify-between'>
        <p className='text-lg font-bold'>{item.organizationName}</p>
        <span className={`text-sm font-semibold ${statusColor}`}>
          ● {statusLabel}
        </span>
      </div>

      {/* 협력사 · 조직 구분 */}
      {(item.parentOrganizationName || item.organizationType) && (
        <p className='mt-1 text-sm text-neutral-500'>
          {[item.parentOrganizationName, item.organizationType]
            .filter(Boolean)
            .join(' ')}
        </p>
      )}

      <div className='mt-1 flex flex-col gap-1'>
        {/* 마스터 회원명 */}
        {item.managerName && (
          <p className='text-sm text-neutral-700'>{item.managerName}</p>
        )}

        {/* 이메일 */}
        {item.managerEmail && (
          <div className='flex items-center gap-1 text-sm text-neutral-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3.5 w-3.5 shrink-0'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
            >
              <rect width='20' height='16' x='2' y='4' rx='2' />
              <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
            </svg>
            <span className='truncate'>{item.managerEmail}</span>
          </div>
        )}

        {/* 생성일 */}
        {item.createdAt && (
          <div className='flex items-center justify-between text-sm text-neutral-400'>
            <span>조직 생성일</span>
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;
