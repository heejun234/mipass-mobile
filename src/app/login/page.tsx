import LogoIcon from '@/public/icons/logo.svg';
import LogoTextIcon from '@/public/icons/text-logo.svg';

const LoginPage = () => {
  return (
    <main className='h-full w-full'>
      <div className='flex h-full w-full items-center justify-start gap-2'>
        <LogoIcon />
        <LogoTextIcon />
      </div>
    </main>
  );
};

export default LoginPage;
