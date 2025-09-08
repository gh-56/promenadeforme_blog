import { Link } from 'react-router-dom';
import { POST_DETAIL_PATH } from '../../constant';
import type { PostResponse } from '../../types/interface';
import { formattedDate } from '../../utils/date-format.js';
import { useMemo } from 'react';
import { Card, Image, Text, Group, Badge, Avatar } from '@mantine/core';

interface TextItem {
  type: 'text';
  text: string;
}
interface ContentBlock {
  content?: TextItem[];
}

const PostCard = ({ post }: { post: PostResponse }) => {
  const { summary, imageUrl } = useMemo(() => {
    if (post.status !== 'published' || !post.content) {
      return { summary: '', imageUrl: '' };
    }

    const firstImageUrl =
      post.images?.[0]?.url || `https://placehold.co/600x400?text=No+Image`;
    let textContent = '';

    try {
      const parsedContent: { content?: ContentBlock[] } = JSON.parse(
        post.content,
      );

      if (parsedContent.content) {
        for (const block of parsedContent.content) {
          if (block.content) {
            for (const item of block.content) {
              if (item.type === 'text' && item.text) {
                textContent += item.text + ' ';
              }
            }
          }
          if (textContent.length > 150) break;
        }
      }
    } catch (error) {
      console.error('콘텐츠 파싱 실패:', error);
      textContent = '내용을 불러올 수 없습니다.';
    }

    return {
      summary: textContent.trim(),
      imageUrl: firstImageUrl,
    };
  }, [post]);

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
        <Image src={imageUrl} height={200} alt='게시글 썸네일 이미지' />
      </Card.Section>

      <Group justify='space-between' mt='md' mb='xs'>
        <Badge color='pink'>{post.category.name}</Badge>
      </Group>

      <Text fw={700} fz='lg' component='h2' truncate='end'>
        {post.title}
      </Text>

      <Text size='sm' c='dimmed' mt='sm' lineClamp={3}>
        {summary}
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
