import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import {
  MAIN_PATH,
  POST_PATH,
  POST_MY_PATH,
  POST_WRITE_PATH,
  CATEGORY_PATH,
  MYPAGE_PATH,
  LOGIN_PATH,
  JOIN_PATH,
} from '../../constant';

import {
  Group,
  Title,
  Button,
  Menu,
  Avatar,
  Text,
  Burger,
  Drawer,
  Stack,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';
import logoImage from '../../assets/promenadeforme_logo.png';

function ThemeToggleButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant='default'
      size='md'
      aria-label='Toggle color scheme'
    >
      {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}

const Header = () => {
  const { colorScheme } = useMantineColorScheme();

  const [opened, { toggle }] = useDisclosure(false);

  const { user, isLoggedIn, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(MAIN_PATH());
    toggle();
  };

  const textColor = colorScheme === 'dark' ? 'gray' : 'black';

  return (
    <Group h='100%' px='md' justify='space-between' mt='md'>
      <Group>
        <Link
          to={MAIN_PATH()}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Group>
            <Avatar src={logoImage} radius={'xs'} size={'sm'} />
            <Title order={3} lts={'3px'}>
              Promenadeforme
            </Title>
          </Group>
        </Link>
      </Group>

      <Group visibleFrom='md'>
        {isLoggedIn ? (
          <>
            <Button
              variant='subtle'
              component={Link}
              to={POST_PATH()}
              color={textColor}
              fw={'normal'}
            >
              전체 글
            </Button>
            <Button
              variant='subtle'
              component={Link}
              to={POST_MY_PATH()}
              color={textColor}
              fw={'normal'}
            >
              내 글
            </Button>
            <Button
              variant='subtle'
              component={Link}
              to={POST_WRITE_PATH()}
              color={textColor}
              fw={'normal'}
            >
              글쓰기
            </Button>
            <Button
              variant='subtle'
              component={Link}
              to={CATEGORY_PATH()}
              color={textColor}
              fw={'normal'}
            >
              카테고리
            </Button>

            <Menu shadow='md' width={200}>
              <Menu.Target>
                <Button variant='subtle' p={4} radius='xl' color={textColor}>
                  <Group>
                    <Avatar
                      src={user?.profileImage?.url}
                      alt='프로필 이미지'
                      radius='xl'
                      size={'sm'}
                    />
                    <Text size='sm' fw={500}>
                      {user?.nickname}
                    </Text>
                  </Group>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user?.email}</Menu.Label>
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  component={Link}
                  to={MYPAGE_PATH()}
                >
                  설정
                </Menu.Item>
                <Menu.Item
                  color='red'
                  leftSection={<IconLogout size={14} />}
                  onClick={() => {
                    logout();
                    navigate(MAIN_PATH());
                  }}
                >
                  로그아웃
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <ThemeToggleButton />
          </>
        ) : (
          <>
            <Button
              variant='subtle'
              component={Link}
              to={LOGIN_PATH()}
              color={textColor}
              fw={'normal'}
            >
              로그인
            </Button>
            <Button
              variant='subtle'
              component={Link}
              to={JOIN_PATH()}
              color={textColor}
              fw={'normal'}
            >
              회원가입
            </Button>

            <ThemeToggleButton />
          </>
        )}
      </Group>

      <Group hiddenFrom='md'>
        <ThemeToggleButton />
        <Burger opened={opened} onClick={toggle} hiddenFrom='md' size='sm' />
      </Group>

      <Drawer
        opened={opened}
        onClose={toggle}
        position='right'
        title='메뉴'
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Stack>
          {isLoggedIn ? (
            <>
              <Button
                variant='subtle'
                component={Link}
                to={POST_PATH()}
                onClick={toggle}
                color={textColor}
                fw={'normal'}
              >
                전체 글
              </Button>
              <Button
                variant='subtle'
                component={Link}
                to={POST_MY_PATH()}
                onClick={toggle}
                color={textColor}
                fw={'normal'}
              >
                내 글
              </Button>
              <Button
                variant='subtle'
                component={Link}
                to={POST_WRITE_PATH()}
                onClick={toggle}
                color={textColor}
                fw={'normal'}
              >
                글쓰기
              </Button>
              <Button
                variant='subtle'
                component={Link}
                to={CATEGORY_PATH()}
                onClick={toggle}
                color={textColor}
                fw={'normal'}
              >
                카테고리
              </Button>
              <Button
                variant='subtle'
                component={Link}
                to={MYPAGE_PATH()}
                onClick={toggle}
                color={textColor}
                fw={'normal'}
              >
                설정
              </Button>
              <Button
                color='red'
                variant='subtle'
                onClick={handleLogout}
                fw={'normal'}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='subtle'
                component={Link}
                to={LOGIN_PATH()}
                onClick={toggle}
                color={textColor}
                fw={'normal'}
              >
                로그인
              </Button>
              <Button
                variant='subtle'
                component={Link}
                to={JOIN_PATH()}
                onClick={toggle}
                fw={'normal'}
              >
                회원가입
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </Group>
  );
};

export default Header;
