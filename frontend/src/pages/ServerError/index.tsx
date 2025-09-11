import {
  Button,
  Container,
  Group,
  Text,
  Title,
  Image,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import errorImage from '../../assets/promenadeforme_500.png';
import { MAIN_PATH } from '../../constant';
import { Link } from 'react-router-dom';

export function ServerError() {
  return (
    <Container mt={'xl'}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={errorImage} />
        {/* Title과 Text에도 폰트 굵기(fw), 위아래 간격(mt, mb) 등을 추가했어요. */}
        <Stack mt={'xl'}>
          <Title ta='center' fw={900} fz={30}>
            일시적인 오류가 발생했습니다.
          </Title>
          <Text c='dimmed' size='lg' ta='center' mt='md' mb='xs'>
            서비스 이용에 불편을 드려 죄송합니다.
          </Text>

          <Text c='dimmed' size='lg' ta='center' mt='xs' mb='xl'>
            서버에 예상치 못한 문제가 발생하여 페이지를 표시할 수 없습니다. 잠시
            후 다시 시도해주세요.
          </Text>
          <Group justify='center'>
            <Button
              variant='outline'
              size='md'
              component={Link}
              to={MAIN_PATH()}
            >
              새로고침
            </Button>
          </Group>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
