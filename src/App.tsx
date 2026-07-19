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
import ShopSettings from './presentation/pages/ShopSettings';
import SupportPage from './presentation/pages/SupportPage';
import type { JSX } from 'react/jsx-runtime';
import SystemSettingsPage from './presentation/pages/admin/SystemSetting';
import ServersManagement from './presentation/pages/admin/ServersManagement';
import VisitorDashboard from './presentation/pages/visitor/VisitorDashboard';
import VisitorTestConfig from './presentation/pages/visitor/VisitorTestConfig';
import TestConfigsList from './presentation/pages/admin/TestConfigsList';
import TransactionsList from './presentation/pages/admin/TransactionsList';
import PublicConfig from './presentation/pages/PublicConfig';

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

const AdminOrSupplierRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'ADMIN' && role !== 'SUPPLIER') return <Navigate to="/dashboard" replace />;

  return children;
};

const VisitorRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  const needsPasswordChange = localStorage.getItem('password_change_required') === 'true';

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (needsPasswordChange) return <Navigate to="/force-password-change" replace />;
  if (role !== 'VISITOR') return <Navigate to="/dashboard" replace />;

  return children;
};

const AdminOrSupplierOrVisitorRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'ADMIN' && role !== 'SUPPLIER' && role !== 'VISITOR') return <Navigate to="/dashboard" replace />;

  return children;
};

const AdminOrVisitorRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'ADMIN' && role !== 'VISITOR') return <Navigate to="/dashboard" replace />;

  return children;
};

const ShopOrAdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  const needsPasswordChange = localStorage.getItem('password_change_required') === 'true';

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (needsPasswordChange) return <Navigate to="/force-password-change" replace />;
  if (role === 'SUPPLIER') return <Navigate to="/dashboard" replace />;

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
  const isSupportDomain = window.location.hostname.includes('support');

  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans text-slate-900">
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'inherit' } }} />

        <Routes>
          <Route
            path="/"
            element={
              isSupportDomain ? (
                <PublicConfig />
              ) : (
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              )
            }
          />

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
              <ShopOrAdminRoute>
                <DashboardLayout>
                  <UsersManagement />
                </DashboardLayout>
              </ShopOrAdminRoute>
            }
          />

          <Route
            path="/proxies"
            element={
              <ShopOrAdminRoute>
                <DashboardLayout>
                  <CreateConfig />
                </DashboardLayout>
              </ShopOrAdminRoute>
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
              <AdminOrSupplierRoute>
                <DashboardLayout>
                  <ServicesManagement />
                </DashboardLayout>
              </AdminOrSupplierRoute>
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
            path="/admin/transactions"
            element={
              <AdminRoute>
                <DashboardLayout>
                  <TransactionsList />
                </DashboardLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/settings/shop"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ShopSettings />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <SupportPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settlements"
            element={
              <AdminOrSupplierOrVisitorRoute>
                <DashboardLayout>
                  <AdminSettlements />
                </DashboardLayout>
              </AdminOrSupplierOrVisitorRoute>
            }
          />
          <Route
            path="/admin/servers"
            element={
              <AdminOrSupplierRoute>
                <DashboardLayout>
                  <ServersManagement />
                </DashboardLayout>
              </AdminOrSupplierRoute>
            }
          />
          <Route
            path="/visitor/shops"
            element={
              <VisitorRoute>
                <DashboardLayout>
                  <VisitorDashboard />
                </DashboardLayout>
              </VisitorRoute>
            }
          />
          <Route
            path="/visitor/test-config"
            element={
              <VisitorRoute>
                <DashboardLayout>
                  <VisitorTestConfig />
                </DashboardLayout>
              </VisitorRoute>
            }
          />
          <Route
            path="/visitor/test-configs"
            element={
              <AdminOrVisitorRoute>
                <DashboardLayout>
                  <TestConfigsList />
                </DashboardLayout>
              </AdminOrVisitorRoute>
            }
          />
          <Route
            path="/:code"
            element={<PublicConfig />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;