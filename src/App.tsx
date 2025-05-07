import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth';
import { LanguageProvider } from './context/language/LanguageContext';
import { ArticleWriterProvider } from './context/articleWriter/ArticleWriterContext';
import DashboardLayout from './components/layout/DashboardLayout';
import GuestLayout from './components/layout/GuestLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import UpdatePassword from './pages/UpdatePassword';
import UpdateProfile from './pages/UpdateProfile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import ArticleWriter from './pages/ArticleWriter/ArticleWriter';
import KeywordResearch from './pages/ArticleWriter/KeywordResearch';
import SelectKeywords from './pages/ArticleWriter/SelectKeywords';
import TitleDescriptionStep from './pages/ArticleWriter/TitleDescriptionStep';
import GeneratedArticle from './pages/ArticleWriter/GeneratedArticle';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Account from './pages/Account';
import Clustering from './pages/Clustering';
import EnhancedOutlineStep from './pages/ArticleWriter/EnhancedOutlineStep';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ArticleWriterProvider>
          <Router>
            <Routes>
              {/* Guest routes */}
              <Route element={<GuestLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
              </Route>

              {/* Protected routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/account" element={<Account />} />
                <Route path="/clustering" element={<Clustering />} />

                {/* Article Writer Routes */}
                <Route path="/article-writer" element={<ArticleWriter />} />
                <Route path="/article-writer/keyword-research" element={<KeywordResearch />} />
                <Route path="/article-writer/select-keywords" element={<SelectKeywords />} />
                <Route path="/article-writer/title-description" element={<TitleDescriptionStep />} />
                {/* Replace the existing OutlineStep route with our enhanced one */}
                <Route path="/article-writer/outline" element={<EnhancedOutlineStep />} />
                <Route path="/article-writer/generated" element={<GeneratedArticle />} />
              </Route>

              {/* Admin route */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Error routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ArticleWriterProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading indicator
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default App;
