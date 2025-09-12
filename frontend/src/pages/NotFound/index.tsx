import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import errorImage from '../../assets/promenadeforme_404.png';
import { Link } from 'react-router-dom';
import { MAIN_PATH } from '../../constant';

function NotFound() {
  return (
    <Container>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={errorImage} />
        <Stack justify='center'>
          <Title ta={{ base: 'center', sm: 'left' }}>
            페이지를 찾을 수 없어요.
          </Title>
          <Text c='dimmed' size='lg' ta={{ base: 'center', sm: 'left' }}>
            요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있어요.
            주소를 다시 한번 확인해주세요!
          </Text>
          <Button
            variant='outline'
            size='md'
            mt='xl'
            component={Link}
            to={MAIN_PATH()}
          >
            홈으로 돌아가기
          </Button>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
export default NotFound;
