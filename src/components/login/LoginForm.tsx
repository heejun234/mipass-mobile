import Input from '../ui/Input';
import { Button } from './Button';

const LoginForm = () => {
  return (
    <div>
      <Input placeholder='아이디' />
      <Input placeholder='비밀번호' />
      <Button>로그인</Button>
    </div>
  );
};

export default LoginForm;
