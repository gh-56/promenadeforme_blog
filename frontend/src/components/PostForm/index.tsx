import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchReadCategories } from '../../api/categories';
import { fetchUploadImage } from '../../api/images';
import { fetchReadAllDraftPost, fetchDeletePost } from '../../api/posts';
import { CATEGORY_PATH } from '../../constant';
import { useTiptapEditor } from '../../hooks/useTiptapEditor';
import type {
  PostResponse,
  PostRequest,
  CategoryResponse,
} from '../../types/interface';
import type { UploadImageResponse } from '../../types/interface/image.interface';
import { RichTextEditor } from '@mantine/tiptap';
import {
  Container,
  Box,
  Button,
  Select,
  Input,
  Group,
  Modal,
  Table,
  ActionIcon,
  Notification,
  Text,
  Title,
  Center,
} from '@mantine/core';
import {
  IconPhotoScan,
  IconFileImport,
  IconTrash,
  IconArrowLeft,
  IconTerminal2,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import type { NodeType, TextType, DocumentType } from '@tiptap/react';

interface PostFormProps {
  pageTitle: string;
  initialPost?: PostResponse;
  onSubmit: (payload: PostRequest) => Promise<void>;
  submitText: string;
}

const PostForm = ({
  pageTitle,
  initialPost,
  onSubmit,
  submitText,
}: PostFormProps) => {
  const [post, setPost] = useState<PostRequest>({
    title: initialPost?.title || '',
    content: initialPost?.content || '',
    category: initialPost?.category._id || '',
    images: initialPost?.images.map((img) => img._id) || [],
    status: initialPost?.status || '',
  });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isCategory, setIstCategory] = useState<boolean>(false);
  const [temporaryPosts, setTemporaryPosts] = useState<PostResponse[]>([]);
  const [isTemporary, setIsTemporary] = useState<boolean>(false);
  const uploadImageIdsRef = useRef<UploadImageResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const focusEditorRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  const handleTiptapUpdate = (
    newContent: DocumentType<
      Record<string, any> | undefined,
      NodeType<
        string,
        undefined | Record<string, any>,
        any,
        (NodeType | TextType)[]
      >[]
    >,
  ) => {
    setPost((currentPost) => {
      return { ...currentPost, content: JSON.stringify(newContent) };
    });
  };

  // 에디터 불러오기
  const editor = useTiptapEditor({
    content: post.content,
    handleTiptapUpdate,
    titleInputRef: focusEditorRef,
    isEditable: true,
  });

  useEffect(() => {
    if (initialPost) {
      setPost({
        title: initialPost.title,
        content: initialPost.content,
        category: initialPost.category._id,
        images: initialPost.images.map((img) => img._id),
        status: initialPost.status || 'draft',
      });

      if (initialPost.images) {
        uploadImageIdsRef.current = initialPost.images;
      }

      if (editor && initialPost.content) {
        const isSameContent =
          JSON.stringify(editor.getJSON()) === initialPost.content;
        if (!isSameContent) {
          editor.commands.setContent(JSON.parse(initialPost.content));
        }
      }
    }
  }, [initialPost, editor]);

  if (!editor) {
    return null;
  }

  function InsertImageControl() {
    return (
      <RichTextEditor.Control
        onClick={() => fileInputRef.current?.click()}
        aria-label='Insert Image'
        title='Insert Image'
      >
        <IconPhotoScan stroke={1.5} size={16} />
      </RichTextEditor.Control>
    );
  }

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoryData: CategoryResponse[] = await fetchReadCategories();
        setCategories(categoryData);
        if (categoryData.length === 0) {
          setIstCategory(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
    focusEditorRef.current?.focus();
  }, []);

  const selectData = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' && editor) {
      event.preventDefault();

      editor.commands.focus('start');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const images = e.target.files;
      const form = new FormData();

      for (const image of images) {
        form.append('images', image);
      }

      try {
        const response: UploadImageResponse[] = await fetchUploadImage(form);

        for (const image of response) {
          editor?.commands.enter();
          editor?.chain().focus().setImage({ src: image.url }).run();
          uploadImageIdsRef.current.push(image);
        }

        const uploadedImageIds = response.map((item) => {
          return item._id;
        });

        setPost((currentPost) => {
          const newImageIds = [
            ...(currentPost.images || []),
            ...uploadedImageIds,
          ];
          return {
            ...currentPost,
            images: newImageIds,
          };
        });

        // setPost((currentPost) => {
        //   let existingImageIds = currentPost.images || [];
        //
        //   const isCurrentlyOnlyDefault =
        //     initialPost?.images?.length === 1 &&
        //     initialPost.images[0].url.includes('default-post-image.jpg');
        //
        //   if (isCurrentlyOnlyDefault) {
        //     existingImageIds = [];
        //   }
        //
        //   return {
        //     ...currentPost,
        //     images: [...existingImageIds, ...uploadedIds],
        //   };
        // });
      } catch (error) {
        console.error('이미지 업로드 실패: ', error);
      }
    }
  };

  //* 게시글 상태를 저장한다. (임시저장 | 발행)
  const handleSaveTemporary = (status: 'draft' | 'published') => {
    setPost({ ...post, status });
  };

  //* 임시 저장 게시글을 모두 불러오는 함수
  const handleReadTemporary = async () => {
    const getTemporaryPosts: PostResponse[] = await fetchReadAllDraftPost();

    setTemporaryPosts(getTemporaryPosts);

    setIsTemporary(true);
  };

  //* 선택된 임시 저장 글을 불러오는 함수
  const handleSelectTemporary = (id: string) => {
    //* 1. 선택한 게시글을 찾는다.
    const selectedPost = temporaryPosts.find((post) => post._id === id);

    if (selectedPost) {
      //* 2. 작성 중인 글이 지워진다는 안내를 한다.
      modals.openConfirmModal({
        title: '임시 저장 게시글 불러오기',
        children: (
          <Text size='sm'>
            임시 저장 글을 불러오시겠습니까? 작성 중인 내용이 모두 지워집니다.
          </Text>
        ),
        labels: { confirm: '불러오기', cancel: '취소' },
        confirmProps: { color: 'teal' },
        onCancel: () => {},
        onConfirm: () => {
          setPost({
            ...post,
            title: selectedPost.title,
            category: selectedPost.category._id,
          });
          editor.commands.setContent(JSON.parse(selectedPost.content));
        },
      });
    }
  };

  const handleDeleteTemporary = async (id: string) => {
    modals.openConfirmModal({
      title: '임시 저장 글 삭제',
      children: <Text size='sm'>임시 저장 글을 삭제하시겠습니까?</Text>,
      labels: { confirm: '삭제', cancel: '취소' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        try {
          await fetchDeletePost(id);
          handleReadTemporary();
          notifications.show({
            title: '임시 저장 게시글 삭제 성공',
            message: '임시 저장 게시글을 성공적으로 삭제하였습니다.',
            color: 'teal',
          });
        } catch (error) {
          console.error(error);

          notifications.show({
            title: '임시 저장 게시글 삭제 실패',
            message: '임시 저장 글 삭제에 실패했습니다.',
            color: 'red',
          });
        }
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('디버깅 - post 객체', post);
      const newContent: DocumentType<
        Record<string, any> | undefined,
        NodeType<
          string,
          undefined | Record<string, any>,
          any,
          (NodeType | TextType)[]
        >[]
      > = JSON.parse(post.content);
      console.log('디버깅 - 게시글 본문', newContent);

      // 본문에 작성된 내용 중 이미지 url만 추출하기
      const newImages = newContent.content
        .filter((item) => item.type === 'imageResize')
        .map((item) => item.attrs?.src);
      const newImagesSet = new Set(newImages);

      console.log('디버깅 - ref 값', uploadImageIdsRef.current);
      // 본문 이미지 url을 통해 이미지 _id 추출하기
      const managedImage = new Set(
        uploadImageIdsRef.current
          .filter((item) => newImagesSet.has(item.url))
          .map((item) => item._id),
      );
      console.log('디버깅 - 본문에 작성된 이미지', managedImage);

      // 본문에서 제거된 이미지 id
      const deletedImageIds = post.images?.filter(
        (item) => !managedImage.has(item),
      );

      console.log(
        '디버깅 - 본문에서 제거되었지만 서버에 요청을 보내는 이미지',
        deletedImageIds,
      );

      // 본문에 있는 이미지만 요청에 보내기 위해 post 상태 덮어쓰기
      const currentImageIds = post.images || [];

      const finalImageIds = currentImageIds.filter(
        (id) => !deletedImageIds?.includes(id),
      );

      // payload로 서버에 요청보내기 (삭제된 이미지 id db에서 제거 위해 요청에 추가)
      const payload = {
        ...post,
        images: finalImageIds,
        deletedImages: deletedImageIds,
      };

      console.log(payload);
      await onSubmit(payload);
    } catch (error) {
      console.error(error);

      notifications.show({
        title: '게시글 작성 실패',
        message: '글 작성에 실패했습니다.',
        color: 'red',
      });
    }
  };

  return (
    <Container mt={'xl'}>
      <Center>
        <Title order={4} mb={'xl'}>
          {pageTitle}
        </Title>
      </Center>
      <form onSubmit={handleSubmit}>
        <Box>
          {isCategory ? (
            <>
              <Notification color='red' title='카테고리가 없습니다!'>
                <Text>글을 작성하려면 먼저 카테고리를 추가해주세요.</Text>

                <Button
                  component={Link}
                  to={CATEGORY_PATH()}
                  variant='transparent'
                  color='red'
                  p={'0px'}
                  fz={'xs'}
                >
                  카테고리 추가하기
                </Button>
              </Notification>
            </>
          ) : (
            <></>
          )}
          <Select
            placeholder='카테고리를 선택해주세요.'
            data={selectData}
            value={post.category}
            onChange={(value) => setPost({ ...post, category: value || '' })}
            searchable
            clearable
            disabled={isCategory}
            nothingFoundMessage='추가된 카테고리가 없습니다.'
            size='sm'
          />
        </Box>

        <Box>
          <Input
            placeholder='제목을 입력하세요.'
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            ref={focusEditorRef}
            value={post.title}
            onKeyDown={handleTitleKeyDown}
            size='xl'
          />

          <input
            type='file'
            name='images'
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
          />
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={'0'}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
                <RichTextEditor.CodeBlock
                  icon={() => <IconTerminal2 size='1rem' stroke={1.5} />}
                />
                <InsertImageControl />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                {/* <RichTextEditor.Subscript /> */}
                {/* <RichTextEditor.Superscript /> */}
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content mih={'300px'} />
          </RichTextEditor>
          {/* <EditorContent className='editor-content' editor={editor} /> */}
        </Box>
        <Group justify='space-between' mt='xl'>
          <Button
            type='button'
            variant='default'
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => {
              modals.openConfirmModal({
                title: '나가기',
                children: (
                  <Text size='sm'>
                    화면을 나가시면 작성 중이던 게시글이 모두 지워집니다.
                  </Text>
                ),
                labels: { confirm: '확인', cancel: '취소' },
                confirmProps: { color: 'red' },
                onCancel: () => {},
                onConfirm: () => nav(-1),
              });
            }}
          >
            나가기
          </Button>

          <Group>
            <Button
              type='button'
              variant='subtle'
              onClick={handleReadTemporary}
            >
              임시저장 목록
            </Button>
            <Button
              type='submit'
              variant='light'
              onClick={() => handleSaveTemporary('draft')}
            >
              임시저장
            </Button>
            <Button
              type='submit'
              variant='filled'
              onClick={() => handleSaveTemporary('published')}
            >
              {submitText}
            </Button>
          </Group>
        </Group>
      </form>
      <Modal
        opened={isTemporary}
        onClose={() => setIsTemporary(false)}
        title='임시저장된 글 목록'
        size='lg'
        centered
      >
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>제목</Table.Th>
              <Table.Th>마지막 저장</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>관리</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {temporaryPosts.length > 0 ? (
              temporaryPosts.map((post) => (
                <Table.Tr key={post._id}>
                  <Table.Td>{post.title}</Table.Td>
                  <Table.Td>
                    {formatDistanceToNow(parseISO(post.updatedAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </Table.Td>
                  <Table.Td>
                    <Group gap='xs' justify='flex-end'>
                      <Button
                        size='xs'
                        variant='light'
                        leftSection={<IconFileImport size={14} />}
                        onClick={() => {
                          handleSelectTemporary(post._id);
                          setIsTemporary(false);
                        }}
                      >
                        불러오기
                      </Button>
                      <ActionIcon
                        variant='light'
                        color='red'
                        onClick={() => handleDeleteTemporary(post._id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} style={{ textAlign: 'center' }}>
                  임시저장된 글이 없습니다.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Modal>
    </Container>
  );
};

export default PostForm;
