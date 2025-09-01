import React, { useState, useEffect } from 'react';
import {
  fetchReadCategories,
  fetchCreateCategory,
  fetchUpdateCategory,
  fetchDeleteCategory,
} from '../../api/categories';
import type { CategoryRequest, CategoryResponse } from '../../types/interface';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './style.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<CategoryRequest>({
    name: '',
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] =
    useState<CategoryRequest>({ name: '' });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchReadCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      }
    };

    getCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCategoryName) return alert('카테고리 이름을 입력하세요.');
    try {
      const newCategory = await fetchCreateCategory(newCategoryName);
      setCategories([...categories, newCategory]);
      setNewCategoryName({ name: '' });
      alert('새로운 카테고리가 생성되었습니다.');
    } catch (error) {
      console.error(error);
      alert('카테고리 추가에 실패했습니다.');
    }
  };

  const handleUpdateClick = (id: string, name: CategoryRequest) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategoryName) return alert('수정할 이름을 입력해 주세요.');
    try {
      const updatedCategory: CategoryResponse = await fetchUpdateCategory(
        editingCategoryId as string,
        editingCategoryName,
      );
      const updatedCategories = categories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category,
      );
      setCategories(updatedCategories);
      setEditingCategoryId(null);
      setEditingCategoryName({ name: '' });
    } catch (error) {
      console.error(error);
      alert('카테고리 수정에 실패했습니다.');
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await fetchDeleteCategory(id);
        setCategories(categories.filter((category) => category._id !== id));
      } catch (error) {
        console.error(error);
        alert('카테고리 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className='category-container'>
      <h1 className='category-title'>카테고리 관리</h1>
      <form onSubmit={handleAddCategory} className='category-add-item'>
        <Input
          type='text'
          value={newCategoryName.name}
          onChange={(e) => setNewCategoryName({ name: e.target.value })}
          placeholder='카테고리 입력'
          className='category-input'
        />
        <Button type='submit'>추가</Button>
      </form>

      <ul className='category-list'>
        {categories.map((category) => (
          <li key={category._id}>
            {editingCategoryId === category._id ? (
              <form onSubmit={handleUpdateSubmit}>
                <div className='category-item'>
                  <Input
                    type='text'
                    value={editingCategoryName.name}
                    onChange={(e) =>
                      setEditingCategoryName({ name: e.target.value })
                    }
                    placeholder='카테고리 입력'
                    className='category-input'
                  />
                  <div className='category-buttons'>
                    <Button type='submit' className='category-button'>
                      저장
                    </Button>
                    <Button
                      type='button'
                      onClick={() => setEditingCategoryId(null)}
                      className='category-button'
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className='category-item'>
                <div className='category-name'>
                  <div>{category.name}</div>
                </div>

                <div className='category-buttons'>
                  <Button
                    onClick={() => handleUpdateClick(category._id, category)}
                    className='category-button'
                  >
                    수정
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(category._id)}
                    className='category-button'
                  >
                    삭제
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
