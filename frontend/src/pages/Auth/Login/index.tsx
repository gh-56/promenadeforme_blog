import { useState } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import type { LoginFormData } from '../../../types/interface';
import { fetchLogin } from '../../../api/users';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from '../../../constant';
import { useUserStore } from '../../../store';
import type { LoginResponse } from '../../../types/interface';

const LoginPage = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const login = useUserStore((state) => state.login);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiResponse: LoginResponse = await fetchLogin(formData);
      const { message, user, token } = apiResponse;
      login(user, token);
      alert(message);
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
