
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth';
import { LanguageProvider } from './context/language/LanguageContext';
import { ArticleWriterProvider } from './context/articleWriter/ArticleWriterContext';
import DashboardLayout from './components/layout/DashboardLayout';
import GuestLayout from './components/layout/GuestLayout';
import NotFound from './pages/NotFound';
import EnhancedOutlineStep from './pages/ArticleWriter/EnhancedOutlineStep';
import TitleDescriptionStep from './pages/ArticleWriter/TitleDescriptionStep';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ArticleWriterProvider>
          <Router>
            <Routes>
              {/* Guest routes */}
              <Route element={<GuestLayout />}>
                <Route path="/login" element={<div>Login Page</div>} />
                <Route path="/register" element={<div>Register Page</div>} />
                <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
                <Route path="/reset-password/:token" element={<div>Reset Password Page</div>} />
                <Route path="/pricing" element={<div>Pricing Page</div>} />
                <Route path="/contact" element={<div>Contact Page</div>} />
                <Route path="/about" element={<div>About Page</div>} />
                <Route path="/terms" element={<div>Terms Page</div>} />
                <Route path="/privacy" element={<div>Privacy Page</div>} />
              </Route>

              {/* Protected routes */}
              <Route element={<DashboardLayout>Dashboard Pages</DashboardLayout>}>
                <Route path="/" element={<div>Home Page</div>} />
                <Route path="/profile" element={<div>Profile Page</div>} />
                <Route path="/update-password" element={<div>Update Password Page</div>} />
                <Route path="/update-profile" element={<div>Update Profile Page</div>} />
                <Route path="/account" element={<div>Account Page</div>} />
                <Route path="/clustering" element={<div>Clustering Page</div>} />

                {/* Article Writer Routes */}
                <Route path="/article-writer" element={<div>Article Writer Page</div>} />
                <Route path="/article-writer/keyword-research" element={<div>Keyword Research Page</div>} />
                <Route path="/article-writer/select-keywords" element={<div>Select Keywords Page</div>} />
                <Route path="/article-writer/title-description" element={<TitleDescriptionStep />} />
                <Route path="/article-writer/outline" element={<EnhancedOutlineStep />} />
                <Route path="/article-writer/generated" element={<div>Generated Article Page</div>} />
              </Route>

              {/* Admin route */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <div>Admin Dashboard</div>
                  </AdminRoute>
                }
              />

              {/* Error routes */}
              <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ArticleWriterProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  // Temporary implementation until isAdmin is properly implemented
  const isAdmin = user && user.email?.includes('admin');

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading indicator
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default App;
