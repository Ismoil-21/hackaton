import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@shared/components/AppShell';
import { Layout } from '@shared/components/Layout';
import { GuestRoute, ProtectedRoute } from '@shared/components/ProtectedRoute';
import { nav } from './nav';

import Login from '@shared/pages/Login';
import Register from '@shared/pages/Register';
import Dashboard from '@shared/pages/Dashboard';
import RequestDetail from '@shared/pages/RequestDetail';
import NotFound from '@shared/pages/NotFound';

/** Foydalanuvchi paneli — :5173 */
export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout nav={nav} variant="user" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
