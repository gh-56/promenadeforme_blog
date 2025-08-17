import React, { useState, useEffect } from 'react';
import {
  fetchGetCategories,
  fetchCreateCategory,
  fetchUpdateCategory,
  fetchDeleteCategory,
} from '../../api/categories';
import type { Category } from '../../types/interface';

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState('');

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchGetCategories();
        setCategories(data);
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
      setNewCategoryName('');
      alert('새로운 카테고리가 생성되었습니다.');
    } catch (error) {
      console.error(error);
      alert('카테고리 추가에 실패했습니다.');
    }
  };

  const handleUpdateClick = (id: string, name: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategoryName) return alert('수정할 이름을 입력해 주세요.');
    try {
      await fetchUpdateCategory(
        editingCategoryId as string,
        editingCategoryName
      );
      const updatedCategories = categories.map((category) =>
        category._id === editingCategoryId
          ? { ...category, name: editingCategoryName }
          : category
      );
      setCategories(updatedCategories);
      setEditingCategoryId(null);
      setEditingCategoryName('');
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
    <div>
      <h1>카테고리 관리</h1>
      <form onSubmit={handleAddCategory}>
        <input
          type='text'
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder='새 카테고리 이름'
        />
        <button type='submit'>추가</button>
      </form>

      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            {editingCategoryId === category._id ? (
              <form onSubmit={handleUpdateSubmit}>
                <input
                  type='text'
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <button type='submit'>저장</button>
                <button
                  type='button'
                  onClick={() => setEditingCategoryId(null)}
                >
                  취소
                </button>
              </form>
            ) : (
              <>
                <span>{category.name}</span>
                <button
                  onClick={() => handleUpdateClick(category._id, category.name)}
                >
                  수정
                </button>
                <button onClick={() => handleDeleteClick(category._id)}>
                  삭제
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
