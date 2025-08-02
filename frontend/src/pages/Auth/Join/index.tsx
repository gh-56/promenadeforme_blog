import { useRef, useState } from 'react';
import type { JoinFormData } from '../../../types/interface';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { fetchCreateUser } from '../../../api/users';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '../../../constant';

const JoinPage = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState<
    JoinFormData & { password_check: string }
  >({
    username: '',
    email: '',
    password: '',
    password_check: '',
    nickname: '',
    bio: '',
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(
    'http://localhost:4000/images/default-profile.png'
  );

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
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleJoinSubmit}>
        <div>
          <label htmlFor='profileImage'>프로필사진</label>
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
        <div>
          <label htmlFor='username'>이름</label>
          <Input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            placeholder=''
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='email'>이메일</label>
          <Input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            placeholder=''
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='password'>비밀번호</label>
          <Input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            placeholder=''
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='password_check'>비밀번호 재확인</label>
          <Input
            type='password'
            id='password_check'
            name='password_check'
            value={formData.password_check}
            placeholder=''
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='nickname'>닉네임</label>
          <Input
            type='text'
            id='nickname'
            name='nickname'
            value={formData.nickname}
            placeholder=''
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor='bio'>상태메시지</label>
          <Input
            type='text'
            id='bio'
            name='bio'
            value={formData.bio || ''}
            placeholder=''
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
