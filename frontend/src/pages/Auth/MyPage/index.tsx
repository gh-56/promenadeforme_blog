import { useRef, useState, useEffect } from 'react';
import type { RegisterRequest } from '../../../types/interface';
import { useUserStore } from '../../../store';
import { fetchUpdateUser } from '../../../api/users';
import type { UploadImageResponse } from '../../../types/interface/image.interface';
import { fetchProfileUploadImage } from '../../../api/images';

import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Center,
  Avatar,
  Indicator,
  Stack,
  Textarea,
  Notification,
  Grid,
  Text,
  Group,
  Divider,
} from '@mantine/core';
import { IconCamera, IconX, IconCheck } from '@tabler/icons-react';

type UpdateUserRequest = Omit<RegisterRequest, 'password'> & {
  currentPassword?: string;
  newPassword?: string;
  password_check?: string;
};

const MyPage = () => {
  const { user, init } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateUserRequest>({
    username: '',
    email: '',
    nickname: '',
    profileImage: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    password_check: '',
  });

  const [previewImage, setPreviewImage] = useState(
    `${import.meta.env.VITE_GCLOUD_STORAGE_IMAGE_URL}/${import.meta.env.VITE_GCLOUD_STORAGE_BUCKET}/default-profile.png`,
  );

  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        profileImage: user.profileImage?._id || '',
        bio: user.bio,
      }));
      if (user.profileImage?.url) {
        setPreviewImage(user.profileImage.url);
      }
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFeedback(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('profileImage', file);
    try {
      const res: UploadImageResponse = await fetchProfileUploadImage(form);
      setFormData({ ...formData, profileImage: res._id });
      setPreviewImage(res.url);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: '이미지 업로드에 실패했습니다.' });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setFeedback({
          type: 'error',
          message: '새 비밀번호를 설정하려면 현재 비밀번호를 입력해야 합니다.',
        });
        return;
      }
      if (formData.newPassword !== formData.password_check) {
        setFeedback({
          type: 'error',
          message: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await fetchUpdateUser(formData);
      setFeedback({
        type: 'success',
        message: '회원정보가 성공적으로 수정되었습니다.',
      });
      await init();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
      setFeedback({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Container size='md' my={40}>
        <Title order={4} mb='xl'>
          회원정보 수정
        </Title>
        <Paper withBorder shadow='md' p={30} radius='md'>
          <form onSubmit={handleEditSubmit}>
            <Stack gap='lg'>
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
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </Center>

              {feedback && (
                <Notification
                  icon={
                    feedback.type === 'success' ? (
                      <IconCheck size={18} />
                    ) : (
                      <IconX size={18} />
                    )
                  }
                  color={feedback.type === 'success' ? 'teal' : 'red'}
                  title={feedback.type === 'success' ? '성공' : '오류'}
                  onClose={() => setFeedback(null)}
                  withCloseButton
                >
                  {feedback.message}
                </Notification>
              )}

              <Grid>
                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Text fw={500} mt={8} ta={{ base: 'left', sm: 'right' }}>
                    이름
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9 }}>
                  <TextInput
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Text fw={500} mt={8} ta={{ base: 'left', sm: 'right' }}>
                    이메일
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9 }}>
                  <TextInput
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Text fw={500} mt={8} ta={{ base: 'left', sm: 'right' }}>
                    닉네임
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9 }}>
                  <TextInput
                    name='nickname'
                    value={formData.nickname}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Text fw={500} mt={8} ta={{ base: 'left', sm: 'right' }}>
                    소개
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9 }}>
                  <Textarea
                    name='bio'
                    value={formData.bio || ''}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Divider my='sm' label='비밀번호 변경 (선택사항)' />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Text fw={500} mt={8} ta={{ base: 'left', sm: 'right' }}>
                    현재 비밀번호
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9 }}>
                  <PasswordInput
                    name='currentPassword'
                    placeholder='변경 시 현재 비밀번호 입력'
                    value={formData.currentPassword || ''}
                    onChange={handleChange}
                    withAsterisk={formData.newPassword ? true : false}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Text fw={500} mt={20} ta={{ base: 'left', sm: 'right' }}>
                    새 비밀번호
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9 }}>
                  <PasswordInput
                    name='newPassword'
                    placeholder='새 비밀번호 (선택사항)'
                    description='8자 이상, 대/소문자, 숫자, 특수문자를 포함해야 합니다.'
                    value={formData.newPassword || ''}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 3 }}>
                  <Text fw={500} mt={8} ta={{ base: 'left', sm: 'right' }}>
                    새 비밀번호 확인
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 9 }}>
                  <PasswordInput
                    name='password_check'
                    placeholder='새 비밀번호 재입력'
                    value={formData.password_check || ''}
                    onChange={handleChange}
                    withAsterisk={formData.newPassword ? true : false}
                  />
                </Grid.Col>
              </Grid>

              <Group justify='flex-end' mt='md'>
                <Button type='submit' loading={isSubmitting}>
                  수정하기
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default MyPage;
