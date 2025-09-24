import { createRoot } from 'react-dom/client';

import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';

import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  fontFamily: 'ChosunGu, sans-serif',
  primaryColor: 'gray',
  components: {
    AppShell: {
      styles: {
        header: {
          maxWidth: '1400px',
          margin: '0 auto',
        },
        main: {
          maxWidth: '1400px',
          margin: '0 auto',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </BrowserRouter>,
);
