import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@shared/context/AuthContext';
import { ToastProvider } from '@shared/context/ToastContext';

/**
 * Ikkala app uchun umumiy provider qatlami.
 * basename Vite `base` dan olinadi -> admin build i /admin/ ostida ham ishlaydi.
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export function AppShell({ children }) {
  return (
    <BrowserRouter basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
