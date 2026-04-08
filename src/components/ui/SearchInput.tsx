/**
 * @author 신희준
 *
 * @description 리스트 검색 입력 컴포넌트
 */

'use client';

import { SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import Input from './Input';
import { useSearchParams } from '@/hooks/useSearchParams';

const SearchInput = () => {
  const { setSearchParam } = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keyword = formData.get('keyword') as string;
    if (keyword.length < 2) {
      toast.info('검색어는 2자 이상 입력해 주세요.');
      return;
    }
    setSearchParam('keyword', keyword);
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mb-4'>
      <Input
        name='keyword'
        Icon={
          <button type='submit' className='flex items-center'>
            <SearchIcon className='h-4 w-4 cursor-pointer' />
          </button>
        }
        placeholder='Search'
      />
    </form>
  );
};

export default SearchInput;
