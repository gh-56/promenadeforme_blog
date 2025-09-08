import { useState } from 'react';
import type { LoginRequest, UserResponse } from '../../../types/interface';
import { fetchLogin } from '../../../api/users';
import { useNavigate, Link } from 'react-router-dom';
import { JOIN_PATH, MAIN_PATH } from '../../../constant';
import { useUserStore } from '../../../store';

import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Group,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const LoginPage = () => {
  const nav = useNavigate();
  const { login, init } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      const loginResponse: UserResponse = await fetchLogin(formData);
      const { user, accessToken } = loginResponse;
      login(accessToken, user);
      await init();
      nav(MAIN_PATH());
    } catch (err: any) {
      setError(
        err?.response?.data?.message || '알 수 없는 오류가 발생했습니다.',
      );
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
          아직 계정이 없으신가요?{' '}
          <Link to={JOIN_PATH()} style={{ textDecoration: 'none' }}>
            <Text c='gray' size='xs' mt={5}>
              회원가입 페이지로 이동
            </Text>
          </Link>
        </Text>
      </Group>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleLoginSubmit}>
          <Stack>
            {error && (
              <Alert
                icon={<IconAlertCircle size='1rem' />}
                title='로그인 실패'
                color='red'
                withCloseButton
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
            <TextInput
              label='이메일'
              placeholder='hello@mantine.dev'
              required
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
            />
            <PasswordInput
              label='비밀번호'
              placeholder='비밀번호를 입력하세요'
              required
              mt='md'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
          </Stack>

          <Button type='submit' fullWidth mt='xl' loading={isSubmitting}>
            로그인
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
