import { getHeaderInfo } from '@/actions/common';
import Divider from '../login/Divider';
import LogoIcon from '@/public/icons/logo.svg';
import Menu from './Menu';

const Header = async () => {
  const headerInfo = await getHeaderInfo();

  const organizationName = headerInfo.data.organizations[0]?.name || '';

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <LogoIcon />
          <p className='text-lg font-bold'>{organizationName}</p>
        </div>

        <div className='flex items-center gap-4'>
          <Menu accountName={headerInfo.data.account.name} />
        </div>
      </div>
      <Divider orientation='horizontal' className='w-full mt-6' bleed />
    </div>
  );
};

export default Header;
