import { useRef, useState } from 'react';
import type { RegisterRequest } from '../../../types/interface';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { fetchCreateUser } from '../../../api/users';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH, MAIN_PATH } from '../../../constant';
import './style.css';
import { Link } from 'react-router-dom';
import { fetchProfileUploadImage } from '../../../api/images';
import type { UploadImageResponse } from '../../../types/interface/image.interface';

// TODO: alert 대신 인라인이나 토스트 스타일로 변경하기
// TODO: 프로필 이미지 우측 하단에 카메라 아이콘 css 연출하기
// TODO: 필수 입력, 선택 입력 알기 쉽게 구분하기
const JoinPage = () => {
  const nav = useNavigate();
  const [registerData, setRegisterData] = useState<
    RegisterRequest & { password_check: string }
  >({
    username: '',
    email: '',
    password: '',
    password_check: '',
    nickname: '',
    profileImage: '',
    bio: '',
  });
  const [previewImage, setPreviewImage] = useState(
    `${import.meta.env.VITE_GCLOUD_STORAGE_IMAGE_URL}/${import.meta.env.VITE_GCLOUD_STORAGE_BUCKET}/default-profile.png`,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File;
    const form = new FormData();
    try {
      form.append('profileImage', file);
      const profileImageFile: UploadImageResponse =
        await fetchProfileUploadImage(form);
      setRegisterData({ ...registerData, profileImage: profileImageFile._id });
      setPreviewImage(profileImageFile.url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (registerData.password !== registerData.password_check) {
        alert('비밀번호와 재확인 비밀번호가 일치하지 않습니다.');
        return;
      }

      await fetchCreateUser(registerData);
      alert('회원가입이 완료되었습니다.');
      nav(LOGIN_PATH());
    } catch (error: any) {
      alert(error?.response?.data?.message);
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
            <img
              src={previewImage}
              alt='프로필 미리보기'
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
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
            value={registerData.username}
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
            value={registerData.email}
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
            value={registerData.password}
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
            value={registerData.password_check}
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
            value={registerData.nickname}
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
            value={registerData.bio || ''}
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
