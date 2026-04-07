import LoginForm from '@/components/login/LoginForm';
import LogoIcon from '@/public/icons/logo.svg';
import LogoTextIcon from '@/public/icons/text-logo.svg';

const LoginPage = () => {
  return (
    <main>
      <div className='flex items-center gap-2'>
        <LogoIcon />
        <LogoTextIcon />
      </div>
      <LoginForm />
    </main>
  );
};

export default LoginPage;
