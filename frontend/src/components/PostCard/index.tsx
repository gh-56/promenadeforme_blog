import { Link } from 'react-router-dom';
import { POST_DETAIL_PATH } from '../../constant';
import type { PostResponse } from '../../types/interface';
import { formattedDate } from '../../utils/date-format.js';
import { Card, Image, Text, Group, Badge, Avatar } from '@mantine/core';

const PostCard = ({ post }: { post: PostResponse }) => {
  if (post.status !== 'published') {
    return null;
  }

  return (
    <Card
      shadow='sm'
      padding='lg'
      radius='md'
      withBorder
      component={Link}
      to={POST_DETAIL_PATH(post._id)}
      style={{ textDecoration: 'none' }}
    >
      <Card.Section>
        <Image src={post.thumbnail} height={200} alt='게시글 썸네일 이미지' />
      </Card.Section>

      <Group justify='start' mt='md' mb='xs'>
        <Badge color='pink' style={{ cursor: 'pointer' }}>
          {post.category.name}
        </Badge>
      </Group>

      <Text fw={700} fz='lg' component='h2' truncate='end'>
        {post.title}
      </Text>

      <Text size='sm' c='dimmed' mt='sm' lineClamp={3} mih={'100px'}>
        {post.summary}
      </Text>

      <Group mt='lg'>
        <Avatar
          src={post.author.profileImage?.url}
          alt='사용자 프로필 이미지'
          radius='xl'
        />
        <div>
          <Text size='sm' fw={500}>
            {post.author.nickname}
          </Text>
          <Text size='xs' c='dimmed'>
            {formattedDate(post.createdAt)}
          </Text>
        </div>
      </Group>
    </Card>
  );
};

export default PostCard;
