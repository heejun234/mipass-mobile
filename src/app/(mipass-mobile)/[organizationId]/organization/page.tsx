import { getOrganizationList } from '@/actions/organization';
import { Button } from '@/components/login/Button';
import OrganizationCard from '@/components/organization/OrganizationCard';
import SearchInput from '@/components/ui/SearchInput';
import { CommonSearchParams } from '@/types/common';

type OrganizationPageProps = {
  searchParams: Promise<CommonSearchParams>;
};

const OrganizationPage = async ({ searchParams }: OrganizationPageProps) => {
  const response = await getOrganizationList(await searchParams);
  const { content } = response.data;

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <p className=' text-lg font-bold'>조직 관리</p>
        <Button size='sm'>
          <p className='text-sm font-semibold'>관리 조직 추가</p>
        </Button>
      </div>

      <SearchInput />

      <div className='flex flex-col gap-3'>
        {content.map((item) => (
          <OrganizationCard key={item.organizationId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default OrganizationPage;
