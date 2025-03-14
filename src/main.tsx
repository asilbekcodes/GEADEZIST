import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './css/index.css';
import './css/apply.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'aos/dist/aos.css';
import { CursorProtect, DevToolsBlocker, DisableScreenshot } from 'react-mower';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CursorProtect message='❌ Websayt Ximoyalangan'>
          <DevToolsBlocker>
            <DisableScreenshot screenMessage='No Screenshot bro'>
              <App />
            </DisableScreenshot>
          </DevToolsBlocker>
        </CursorProtect>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          limit={1}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
