import './style.css';
import { Link } from 'react-router-dom';
import {
  CATEGORY_PATH,
  MAIN_PATH,
  POST_PATH,
  POST_WRITE_PATH,
  LOGIN_PATH,
  JOIN_PATH,
} from '../../constant';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useState } from 'react';
import { useUserStore } from '../../store';

const Header = () => {
  const { isLoggedIn, user, logout } = useUserStore();
  const [searchValue, setSearchValue] = useState('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <header className='header-container'>
      <div className='header-logo'>
        <Link to={MAIN_PATH()}>
          <h1>Promenadeforme</h1>
        </Link>
      </div>
      <nav className='header-menu'>
        <div className='header-nav-list'>
          {isLoggedIn ? (
            <>
              <Link to='/'>소개</Link>
              <Link to={POST_PATH()}>글 목록</Link>
              <Link to={POST_WRITE_PATH()}>글 쓰기</Link>
              <Link to={CATEGORY_PATH()}>편집</Link>
              <span>{user?.nickname}님, 안녕하세요!</span>
              <Button className='logout-button' onClick={logout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link to='/'>소개</Link>
              <Link to={POST_PATH()}>글 목록</Link>
              <Link to={LOGIN_PATH()}>로그인</Link>
              <Link to={JOIN_PATH()}>회원가입</Link>
            </>
          )}
        </div>
        <div className='header-search'>
          <Input
            id='search'
            type='text'
            placeholder='검색어를 입력하세요.'
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
