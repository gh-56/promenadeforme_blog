import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Header from '../Header';

const MainLayout = () => {
  return (
    <AppShell header={{ height: 60 }} padding='md'>
      <AppShell.Header withBorder={false}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
export default MainLayout;
