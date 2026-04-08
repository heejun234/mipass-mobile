'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import MenuIcon from '@/public/icons/menu.svg';
import { useSession } from 'next-auth/react';

const Menu = () => {
  const router = useRouter();
  const session = useSession();
  const organizationId = session.data?.organizationId;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-40'
        align='end'
        alignOffset={0}
        sideOffset={5}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/${organizationId}/organization`)}
          >
            조직 관리
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${organizationId}/user`)}
          >
            회원 관리
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${organizationId}/auth-history`)}
          >
            인증 이력 관리
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${organizationId}/equipment`)}
          >
            장비 관리
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${organizationId}/partner`)}
          >
            협력사 관리
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
