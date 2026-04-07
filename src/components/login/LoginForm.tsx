import Input from '../ui/Input';
import { Button } from './Button';
import Divider from './Divider';

const LoginForm = () => {
  return (
    <div className='flex w-full flex-col gap-4'>
      <Input placeholder='아이디' />
      <Input placeholder='비밀번호' />
      <Button variant='login'>로그인</Button>
      <Divider orientation='horizontal' className='w-full' />
      <Button variant='outline' className='rounded-full'>
        얼굴 로그인
      </Button>
    </div>
  );
};

export default LoginForm;
