import { useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import type { LoginRequest, UserResponse } from "../../../types/interface";
import { fetchLogin } from "../../../api/users";
import { useNavigate } from "react-router-dom";
import { JOIN_PATH, MAIN_PATH } from "../../../constant";
import { useUserStore } from "../../../store";
import "./style.css";
import { Link } from "react-router-dom";

// TODO: alert을 인라인 혹은 토스트 방식으로 변경하기
// TODO: 로딩 스피너 추가하기
const LoginPage = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const login = useUserStore((state) => state.login);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginResponse: UserResponse = await fetchLogin(formData);
      const { user, accessToken } = loginResponse;
      login(accessToken, user);
      nav(MAIN_PATH());
    } catch (error: any) {
      alert(error?.response?.data?.message);
      console.error(error);
    }
  };
  return (
    <div className="login-container">
      <Link to={MAIN_PATH()} className="login-title">
        Promenadeforme
      </Link>
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <div className="login-input-box">
          {/* <label htmlFor='email'>이메일</label> */}
          <Input
            className="login-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
          />
        </div>
        <div className="login-input-box">
          {/* <label htmlFor='email'>비밀번호</label> */}
          <Input
            className="login-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
          />
        </div>
        <Button className="login-button" type="submit">
          로그인
        </Button>
        <Link to={JOIN_PATH()} className="to-join-page">
          회원가입 페이지로 이동
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
