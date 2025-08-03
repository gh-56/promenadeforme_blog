import { useState } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import type { LoginFormData } from '../../../types/interface';
import { fetchLogin } from '../../../api/users';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from '../../../constant';

const LoginPage = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetchLogin(formData);
      alert('로그인이 완료되었습니다.');
      nav(MAIN_PATH());
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor='email'>이메일</label>
          <Input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='이메일을 입력해주세요.'
          />
        </div>
        <div>
          <label htmlFor='email'>비밀번호</label>
          <Input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='비밀번호를 입력해주세요.'
          />
        </div>
        <Button type='submit'>로그인</Button>
      </form>
    </div>
  );
};

export default LoginPage;
