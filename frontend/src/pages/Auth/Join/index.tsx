import { useRef, useState } from 'react';
import type { RegisterRequest } from '../../../types/interface';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { fetchCreateUser } from '../../../api/users';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH, MAIN_PATH } from '../../../constant';
import './style.css';
import { Link } from 'react-router-dom';

// TODO: alert 대신 인라인이나 토스트 스타일로 변경하기
// TODO: 프로필 이미지 우측 하단에 카메라 아이콘 css 연출하기
// TODO: 필수 입력, 선택 입력 알기 쉽게 구분하기
const JoinPage = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest & { password_check: string }>({
    username: '',
    email: '',
    password: '',
    password_check: '',
    nickname: '',
    bio: '',
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('http://localhost:4000/images/default-profile.png');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfileImageFile(file);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.password_check) {
        alert('비밀번호와 재확인 비밀번호가 일치하지 않습니다.');
        return;
      }
      const form = new FormData();
      form.append('username', formData.username);
      form.append('email', formData.email);
      form.append('nickname', formData.nickname);
      form.append('password', formData.password);
      form.append('bio', formData.bio || '');
      if (profileImageFile) {
        form.append('profileImage', profileImageFile);
      }
      await fetchCreateUser(form);
      alert('회원가입이 완료되었습니다.');
      nav(LOGIN_PATH());
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='join-container'>
      <Link to={MAIN_PATH()} className='join-title'>
        Promenadeforme
      </Link>
      <form className='join-form' onSubmit={handleJoinSubmit}>
        <div>
          <div onClick={handleClickImage} style={{ cursor: 'pointer' }}>
            <img src={previewImage} alt='프로필 미리보기' style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          </div>
          <input
            id='profileImage'
            type='file'
            name='profileImage'
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
        <div className='join-input-box'>
          <Input
            className='join-input'
            type='text'
            id='username'
            name='username'
            value={formData.username}
            placeholder='이름'
            onChange={handleChange}
          />
        </div>
        <div className='join-input-box'>
          <Input
            className='join-input'
            type='email'
            id='email'
            name='email'
            value={formData.email}
            placeholder='이메일'
            onChange={handleChange}
          />
        </div>
        <div className='join-input-box'>
          <Input
            className='join-input'
            type='password'
            id='password'
            name='password'
            value={formData.password}
            placeholder='비밀번호'
            onChange={handleChange}
          />
        </div>
        <div className='join-input-box'>
          <Input
            className='join-input'
            type='password'
            id='password_check'
            name='password_check'
            value={formData.password_check}
            placeholder='비밀번호 확인'
            onChange={handleChange}
          />
        </div>
        <div className='join-input-box'>
          <Input
            className='join-input'
            type='text'
            id='nickname'
            name='nickname'
            value={formData.nickname}
            placeholder='닉네임'
            onChange={handleChange}
          />
        </div>

        <div className='join-input-box'>
          <Input
            className='join-input'
            type='text'
            id='bio'
            name='bio'
            value={formData.bio || ''}
            placeholder='상태메세지'
            onChange={handleChange}
          />
        </div>
        <Button className={'join-button'} type={'submit'}>
          가입하기
        </Button>
      </form>
    </div>
  );
};

export default JoinPage;
