import LoginForm from '@/components/login/LoginForm';
import LogoIcon from '@/public/icons/logo.svg';
import LogoTextIcon from '@/public/icons/text-logo.svg';

const LoginPage = () => {
  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <div className='flex items-center justify-center gap-2'>
        <LogoIcon />
        <LogoTextIcon />
      </div>
      <p className='text-lg text-center text-neutral-500 my-6'>
        조직과 사람을 연결하는 <span className='font-bold'>아이제너스 나</span>
      </p>
      <LoginForm />
    </main>
  );
};

export default LoginPage;
