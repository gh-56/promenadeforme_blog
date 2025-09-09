import { useRef, useState } from 'react';
import type { RegisterRequest } from '../../../types/interface';
import { fetchCreateUser } from '../../../api/users';
import { useNavigate, Link } from 'react-router-dom';
import { LOGIN_PATH, MAIN_PATH } from '../../../constant';
import { fetchProfileUploadImage } from '../../../api/images';
import type { UploadImageResponse } from '../../../types/interface/image.interface';

import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Center,
  Avatar,
  Indicator,
  Stack,
  Textarea,
  Notification,
  Group,
} from '@mantine/core';
import { IconCamera, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const JoinPage = () => {
  const nav = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setError(null);
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('profileImage', file);
    try {
      const res: UploadImageResponse = await fetchProfileUploadImage(form);
      setRegisterData({ ...registerData, profileImage: res._id });
      setPreviewImage(res.url);
    } catch (err) {
      console.error(err);
      setError('이미지 업로드에 실패했습니다.');
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (registerData.password !== registerData.password_check) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsSubmitting(false);
      return;
    }
    if (registerData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      await fetchCreateUser(registerData);
      notifications.show({
        message: '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.',
        color: 'teal',
      });
      nav(LOGIN_PATH());
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size='xs' my={40}>
      <Link
        to={MAIN_PATH()}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Title ta='center' order={3} lts={'3px'}>
          Promenadeforme
        </Title>
      </Link>
      <Group justify='center'>
        <Text c='dimmed' size='sm' ta='center' mt={5}>
          이미 계정이 있으신가요?{' '}
          <Link to={LOGIN_PATH()} style={{ textDecoration: 'none' }}>
            <Text c='gray' size='xs' mt={5}>
              로그인 페이지로 이동
            </Text>
          </Link>
        </Text>
      </Group>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleJoinSubmit}>
          <Stack>
            <Center>
              <Indicator
                inline
                size={28}
                offset={12}
                position='bottom-end'
                color='gray'
                withBorder
                label={<IconCamera size={16} />}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer' }}
              >
                <Avatar
                  src={previewImage}
                  size={100}
                  radius='50%'
                  alt='프로필 미리보기'
                />
              </Indicator>
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Center>

            <TextInput
              label='이름'
              placeholder='이름을 입력하세요'
              withAsterisk
              name='username'
              value={registerData.username}
              onChange={handleChange}
              required
            />
            <TextInput
              label='이메일'
              placeholder='promenadeforme@example.com'
              withAsterisk
              name='email'
              value={registerData.email}
              onChange={handleChange}
              required
              type='email'
            />
            <PasswordInput
              label='비밀번호'
              placeholder='비밀번호를 입력하세요'
              withAsterisk
              name='password'
              value={registerData.password}
              onChange={handleChange}
              required
            />
            <PasswordInput
              label='비밀번호 확인'
              placeholder='비밀번호를 다시 한번 입력하세요'
              withAsterisk
              name='password_check'
              value={registerData.password_check}
              onChange={handleChange}
              required
            />
            <TextInput
              label='닉네임'
              placeholder='사용하실 닉네임을 입력하세요'
              withAsterisk
              name='nickname'
              value={registerData.nickname}
              onChange={handleChange}
              required
            />
            <Textarea
              label='소개'
              placeholder='자신을 소개해보세요 (선택사항)'
              name='bio'
              value={registerData.bio || ''}
              onChange={handleChange}
            />
          </Stack>

          {error && (
            <Notification
              icon={<IconX size={18} />}
              color='red'
              title='오류'
              onClose={() => setError(null)}
              withCloseButton={false}
              mt={'md'}
            >
              {error}
            </Notification>
          )}

          <Button type='submit' fullWidth mt='xl' loading={isSubmitting}>
            가입하기
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default JoinPage;
