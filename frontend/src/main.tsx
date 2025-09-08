import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './assets/fonts.css';

import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'ChosunGu, sans-serif',
  primaryColor: 'gray',
  components: {
    AppShell: {
      styles: {
        header: {
          maxWidth: '1300px',
          margin: '0 auto',
        },
        main: {
          maxWidth: '1300px',
          margin: '0 auto',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
);
