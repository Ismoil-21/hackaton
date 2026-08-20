import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@shared/components/AppShell';
import { Layout } from '@shared/components/Layout';
import { GuestRoute, ProtectedRoute } from '@shared/components/ProtectedRoute';
import { nav } from './nav';

import Login from '@shared/pages/Login';
import AdminDashboard from '@shared/pages/AdminDashboard';
import RequestDetail from '@shared/pages/RequestDetail';
import Users from '@shared/pages/Users';
import Forbidden from '@shared/pages/Forbidden';
import NotFound from '@shared/pages/NotFound';

/** Admin paneli — :5174 (alohida origin, alohida sessiya) */
export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login showRegister={false} title="Admin panelga kirish" />} />
        </Route>

        <Route path="/forbidden" element={<ProtectedRoute />}>
          <Route index element={<Forbidden hint="Foydalanuvchi paneli: http://localhost:5173" />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} fallback="/forbidden" />}>
          <Route element={<Layout nav={nav} variant="admin" />}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
