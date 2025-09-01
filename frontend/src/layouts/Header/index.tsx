import './style.css';
import { Link } from 'react-router-dom';
import {
  CATEGORY_PATH,
  MAIN_PATH,
  POST_PATH,
  POST_WRITE_PATH,
  LOGIN_PATH,
  JOIN_PATH,
  POST_MY_PATH,
} from '../../constant';
// import Input from '../../components/Input';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store';

const Header = () => {
  const { isLoggedIn, user, logout } = useUserStore();
  // const [searchValue, setSearchValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchValue(e.target.value);
  // };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className='header-container'>
      <div className='header-logo'>
        <Link to={MAIN_PATH()}>
          {isMenuOpen ? (
            <h1 onClick={toggleMenu}>Promenadeforme</h1>
          ) : (
            <h1>Promenadeforme</h1>
          )}
        </Link>
      </div>
      <nav className='header-menu'>
        <div className={`header-nav-list ${isMenuOpen ? 'open' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to={POST_PATH()} onClick={toggleMenu}>
                전체 글 보기
              </Link>
              <Link to={POST_MY_PATH()} onClick={toggleMenu}>
                내 글 보기
              </Link>
              <Link to={POST_WRITE_PATH()} onClick={toggleMenu}>
                글 쓰기
              </Link>
              <Link to={CATEGORY_PATH()} onClick={toggleMenu}>
                카테고리
              </Link>

              <div className='profile-box' onClick={toggleProfile}>
                <div className='profile-info'>
                  <div className='profile-image-box'>
                    <img src={user?.profileImage} alt='프로필 이미지' />
                  </div>
                  <div className='profile-nickname'>{user?.nickname}</div>
                </div>

                <div
                  className={`profile-detail ${isProfileOpen ? 'open' : ''}`}
                >
                  <div className='detail-header'>
                    <div className='detail-image-box'>
                      <img src={user?.profileImage} alt='프로필 이미지' />
                    </div>
                    <div className='detail-nickname'>{user?.nickname}</div>
                  </div>

                  <div className='detail-links'>
                    <Link to={CATEGORY_PATH()} onClick={toggleMenu}>
                      마이페이지
                    </Link>
                    <span
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      로그아웃
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* <Link to={POST_PATH()} onClick={toggleMenu}>
                글 목록
              </Link> */}
              <Link to={LOGIN_PATH()} onClick={toggleMenu}>
                로그인
              </Link>
              <Link to={JOIN_PATH()} onClick={toggleMenu}>
                회원가입
              </Link>
            </>
          )}
        </div>
        <button className='hamburger-button' onClick={toggleMenu}>
          ☰
        </button>
        {/* <div className='header-search'>
          <Input
            className='header-input'
            id='search'
            type='text'
            placeholder='검색어를 입력하세요.'
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div> */}
      </nav>
    </header>
  );
};

export default Header;
