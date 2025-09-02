import { useEffect, useRef, useState } from 'react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import type { RegisterRequest, UserProfile } from '../../../types/interface';
import { useUserStore } from '../../../store';
import { fetchUpdateUser } from '../../../api/users';
import { useNavigate } from 'react-router-dom';
import type { UploadImageResponse } from '../../../types/interface/image.interface';
import { fetchProfileUploadImage } from '../../../api/images';
import './style.css';

const MyPage = () => {
  const [registerData, setRegisterData] = useState<
    RegisterRequest & { newPassword: string; password_check: string }
  >({
    username: '',
    email: '',
    password: '',
    newPassword: '',
    password_check: '',
    nickname: '',
    profileImage: '',
    bio: '',
  });
  const [previewImage, setPreviewImage] = useState(
    `${import.meta.env.VITE_API_URL}/images/default-profile.png`,
  );
  const nav = useNavigate();
  const { init } = useUserStore();

  useEffect(() => {
    const user = useUserStore.getState().user as UserProfile;
    setRegisterData({
      ...registerData,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      bio: user.bio,
    });
    setPreviewImage(user.profileImage.url);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (registerData.newPassword !== registerData.password_check) {
        alert('비밀번호와 재확인 비밀번호가 일치하지 않습니다.');
        return;
      }
      await fetchUpdateUser(registerData);
      alert('회원정보 수정이 완료되었습니다.');
      nav('/');
      init();
    } catch (error: any) {
      alert(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleClickImage = () => {
    fileInputRef.current?.click();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  return (
    <div className='edit-profile-container'>
      <form className='edit-profile-form' onSubmit={handleEditSubmit}>
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
        <div className='edit-profile-input-box'>
          <div className='edit-profile-name'>
            <h3>이름</h3>
          </div>
          <Input
            className='edit-profile-input'
            type='text'
            id='username'
            name='username'
            value={registerData.username}
            placeholder='이름'
            onChange={handleChange}
          />
        </div>
        <div className='edit-profile-input-box'>
          <div className='edit-profile-name'>
            <h3>이메일</h3>
          </div>
          <Input
            className='edit-profile-input'
            type='email'
            id='email'
            name='email'
            value={registerData.email}
            placeholder='이메일'
            onChange={handleChange}
          />
        </div>
        <div className='edit-profile-input-box'>
          <div className='edit-profile-name'>
            <h3>닉네임</h3>
          </div>
          <Input
            className='edit-profile-input'
            type='text'
            id='nickname'
            name='nickname'
            value={registerData.nickname}
            placeholder='닉네임'
            onChange={handleChange}
          />
        </div>

        <div className='edit-profile-input-box'>
          <div className='edit-profile-name'>
            <h3>상태메세지</h3>
          </div>
          <textarea
            className='bio-textarea'
            id='bio'
            name='bio'
            value={registerData.bio || ''}
            placeholder='상태메세지'
            onChange={(e) =>
              setRegisterData({ ...registerData, bio: e.target.value })
            }
          />
        </div>
        <div className='edit-profile-input-box'>
          <div className='edit-profile-name'>
            <h3>비밀번호</h3>
          </div>
          <Input
            className='edit-profile-input'
            type='password'
            id='password'
            name='password'
            value={registerData.password}
            placeholder='* 현재 비밀번호'
            onChange={handleChange}
          />
        </div>
        <div className='edit-profile-input-box'>
          <div className='edit-profile-name'>
            <h3>새 비밀번호</h3>
          </div>
          <Input
            className='edit-profile-input'
            type='password'
            id='newPassword'
            name='newPassword'
            value={registerData.newPassword}
            placeholder='새 비밀번호 (option)'
            onChange={handleChange}
          />
        </div>
        <div className='edit-profile-input-box'>
          <div className='edit-profile-name'>
            <h3>비밀번호 확인</h3>
          </div>
          <Input
            className='edit-profile-input'
            type='password'
            id='password_check'
            name='password_check'
            value={registerData.password_check}
            placeholder='새 비밀번호 확인'
            onChange={handleChange}
          />
        </div>
        <Button className={'edit-profile-button'} type={'submit'}>
          수정하기
        </Button>
      </form>
    </div>
  );
};

export default MyPage;
