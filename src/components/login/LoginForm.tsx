'use client';

import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import { Button } from './Button';
import Divider from './Divider';
import { useState } from 'react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('이메일을 입력하세요.');
      return;
    }

    if (!password) {
      toast.error('비밀번호를 입력하세요.');
      return;
    }

    try {
      // 일반 로그인
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const resultCode = result?.code
          ? JSON.parse(result?.code as string).code
          : null;
        const resultData = result?.code
          ? JSON.parse(result?.code as string).data
          : null;

        /*   switch (resultCode) {
            case 'ACC_AUTH_002':
              setDialogOpen(true);
              setRemainingTime(resultData.remainingLockTime);
              break;

            case 'ACC_AUTH_003':
              toast.error('관리자 페이지에 접근할 수 있는 권한이 없습니다.');
              break;

            default:
              toast.error('로그인에 실패했습니다.');
          } */
      } else {
        toast.success('로그인 성공!');

        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();

        const organizationId = session?.organizationId;

        router.push(`/${organizationId}/dashboard`);

        /* router.refresh(); */
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    } finally {
      /* setIsLoading(false); */
    }
  };

  return (
    <form onSubmit={handleLogin} className='flex w-full flex-col gap-4'>
      <Input
        placeholder='아이디'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder='비밀번호'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type='password'
      />
      <Button variant='login' type='submit'>
        로그인
      </Button>
      <Divider orientation='horizontal' className='w-full' />
      <Button variant='outline' className='rounded-full'>
        얼굴 로그인
      </Button>
    </form>
  );
};

export default LoginForm;
