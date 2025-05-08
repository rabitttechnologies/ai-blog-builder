
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth';
import { LanguageProvider } from './context/language/LanguageContext';
import { ArticleWriterProvider } from './context/articleWriter/ArticleWriterContext';
import DashboardLayout from './components/layout/DashboardLayout';
import GuestLayout from './components/layout/GuestLayout';
import NotFound from './pages/NotFound';
import EnhancedOutlineStep from './pages/ArticleWriter/EnhancedOutlineStep';
import TitleDescriptionStep from './pages/ArticleWriter/TitleDescriptionStep';
import GeneratedArticleStep from './pages/ArticleWriter/GeneratedArticleStep';

// Temporary page components until actual pages are implemented
const Home = () => <div className="p-6">Home Page</div>;
const Login = () => <div className="p-6">Login Page</div>;
const Register = () => <div className="p-6">Register Page</div>;
const ForgotPassword = () => <div className="p-6">Forgot Password Page</div>;
const ResetPassword = () => <div className="p-6">Reset Password Page</div>;
const Profile = () => <div className="p-6">Profile Page</div>;
const UpdatePassword = () => <div className="p-6">Update Password Page</div>;
const UpdateProfile = () => <div className="p-6">Update Profile Page</div>;
const Account = () => <div className="p-6">Account Page</div>;
const Clustering = () => <div className="p-6">Clustering Page</div>;
const ArticleWriter = () => <div className="p-6">Article Writer Page</div>;
const KeywordResearch = () => <div className="p-6">Keyword Research Page</div>;
const SelectKeywords = () => <div className="p-6">Select Keywords Page</div>;
const Pricing = () => <div className="p-6">Pricing Page</div>;
const Contact = () => <div className="p-6">Contact Page</div>;
const About = () => <div className="p-6">About Page</div>;
const Terms = () => <div className="p-6">Terms Page</div>;
const Privacy = () => <div className="p-6">Privacy Page</div>;
const Unauthorized = () => <div className="p-6">Unauthorized Page</div>;
const AdminDashboard = () => <div className="p-6">Admin Dashboard</div>;
// Create a simple KeywordEntryStep component to match the route
const KeywordEntryStep = () => <div className="p-6">Keyword Entry Step</div>;

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ArticleWriterProvider>
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
              <Route path="/article-writer/keyword-entry" element={<KeywordEntryStep />} />
              <Route path="/article-writer/select-keywords" element={<SelectKeywords />} />
              <Route path="/article-writer/title-description" element={<TitleDescriptionStep />} />
              <Route path="/article-writer/outline" element={<EnhancedOutlineStep />} />
              <Route path="/article-writer/generated" element={<GeneratedArticleStep />} />
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
