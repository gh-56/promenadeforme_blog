import React, { useState, useEffect } from 'react';
import {
  fetchReadCategories,
  fetchCreateCategory,
  fetchUpdateCategory,
  fetchDeleteCategory,
} from '../../api/categories';
import type { CategoryResponse } from '../../types/interface';

import {
  Container,
  Title,
  Stack,
  Group,
  TextInput,
  Button,
  Paper,
  Text,
  Loader,
  Center,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const CategoryPage = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchReadCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('카테고리 이름을 입력하세요.');
      return;
    }
    try {
      const newCategory = await fetchCreateCategory({ name: newCategoryName });
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (error) {
      console.error(error);
      alert('카테고리 추가에 실패했습니다.');
    }
  };

  const handleUpdateClick = (category: CategoryResponse) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategoryId || !editingCategoryName.trim()) return;
    try {
      const updatedCategory: CategoryResponse = await fetchUpdateCategory(
        editingCategoryId,
        {
          name: editingCategoryName,
        },
      );
      setCategories(
        categories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat,
        ),
      );
      setEditingCategoryId(null);
    } catch (error) {
      console.error(error);
      alert('카테고리 수정에 실패했습니다.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingCategoryId(id);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategoryId) return;
    try {
      await fetchDeleteCategory(deletingCategoryId);
      setCategories(categories.filter((cat) => cat._id !== deletingCategoryId));
    } catch (error) {
      console.error(error);
      alert('카테고리 삭제에 실패했습니다.');
    } finally {
      closeDeleteModal();
    }
  };

  if (isLoading) {
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Container py='lg'>
        <Stack gap='xl'>
          <Title order={4}>카테고리 관리</Title>

          <form onSubmit={handleAddCategory}>
            <Group>
              <TextInput
                placeholder='새로운 카테고리 이름'
                style={{ flex: 1 }}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.currentTarget.value)}
                required
              />
              <Button type='submit'>추가</Button>
            </Group>
          </form>

          <Stack gap='xs'>
            {categories.map((category) => (
              <Paper withBorder p='md' radius='md' key={category._id}>
                {editingCategoryId === category._id ? (
                  <form onSubmit={handleUpdateSubmit}>
                    <Group justify='space-between'>
                      <TextInput
                        style={{ flex: 1 }}
                        value={editingCategoryName}
                        onChange={(e) =>
                          setEditingCategoryName(e.currentTarget.value)
                        }
                        autoFocus
                      />
                      <Group>
                        <Button type='submit' size='xs'>
                          저장
                        </Button>
                        <Button
                          variant='default'
                          size='xs'
                          onClick={() => setEditingCategoryId(null)}
                        >
                          취소
                        </Button>
                      </Group>
                    </Group>
                  </form>
                ) : (
                  <Group justify='space-between'>
                    <Text fw={500}>{category.name}</Text>
                    <Group>
                      <Button
                        variant='default'
                        size='xs'
                        onClick={() => handleUpdateClick(category)}
                      >
                        수정
                      </Button>
                      <Button
                        variant='light'
                        color='red'
                        size='xs'
                        onClick={() => handleDeleteClick(category._id)}
                      >
                        삭제
                      </Button>
                    </Group>
                  </Group>
                )}
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Container>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title='카테고리 삭제'
        centered
      >
        <Stack>
          <Text size='sm'>정말로 이 카테고리를 삭제하시겠습니까?</Text>
          <Group justify='flex-end' mt='md'>
            <Button variant='default' onClick={closeDeleteModal}>
              취소
            </Button>
            <Button color='red' onClick={handleDeleteConfirm}>
              삭제
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default CategoryPage;
