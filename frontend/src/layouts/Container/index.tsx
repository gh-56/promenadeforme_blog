import Footer from '../Footer';
import Header from '../Header';
import { Outlet } from 'react-router-dom';

const Container = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Container;
