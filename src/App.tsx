import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './presentation/pages/Login';
import DashboardHome from './presentation/pages/DashboardHome';
import DashboardLayout from './presentation/components/DashboardLayout';
import ForceChangePassword from './presentation/pages/ForceChangePassword';
import UsersManagement from './presentation/pages/UsersManagement';
import CreateConfig from './presentation/pages/CreateConfig';
import ShopsManagement from './presentation/pages/admin/ShopsManagement';
import ServicesManagement from './presentation/pages/admin/ServicesManagement';
import AdminSettlements from './presentation/pages/admin/AdminSettlements';
import ShopCustomPrices from './presentation/pages/ShopCustomPrices';
import type { JSX } from 'react/jsx-runtime';
import SystemSettingsPage from './presentation/pages/admin/SystemSetting';
import ServersManagement from './presentation/pages/admin/ServersManagement';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const needsPasswordChange = localStorage.getItem('password_change_required') === 'true';

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (needsPasswordChange) return <Navigate to="/force-password-change" replace />;

  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const ForcePasswordRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const needsPasswordChange = localStorage.getItem('password_change_required') === 'true';

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!needsPasswordChange) return <Navigate to="/dashboard" replace />;

  return children;
};

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans text-slate-900">
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'inherit' } }} />

        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route
            path="/force-password-change"
            element={<ForcePasswordRoute><ForceChangePassword /></ForcePasswordRoute>}
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <DashboardHome />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <UsersManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/proxies"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <CreateConfig />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/shops"
            element={
              <AdminRoute>
                <DashboardLayout>
                  <ShopsManagement />
                </DashboardLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminRoute>
                <DashboardLayout>
                  <ServicesManagement />
                </DashboardLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <DashboardLayout>
                  <SystemSettingsPage />
                </DashboardLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/settings/prices"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ShopCustomPrices />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settlements"
            element={
              <AdminRoute>
                <DashboardLayout>
                  <AdminSettlements />
                </DashboardLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/servers"
            element={
              <AdminRoute>
                <DashboardLayout>
                  <ServersManagement />
                </DashboardLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;