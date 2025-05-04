import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/auth';
import { LanguageProvider } from './context/language/LanguageContext';
import { ThemeProvider } from './context/theme';
import { SidebarProvider } from './context/sidebar';
import { ToastProvider } from '@/hooks/use-toast';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import ArticleWriter from './pages/ArticleWriter';

// Import the TitleDescriptionStep component
import TitleDescriptionStep from '@/pages/ArticleWriter/TitleDescriptionStep';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <LanguageProvider>
        <AuthProvider>
          <SidebarProvider>
            <ToastProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/article-writer"
                    element={
                      <ProtectedRoute>
                        <ArticleWriter />
                      </ProtectedRoute>
                    }
                  />
                  {/* New route for TitleDescriptionStep */}
                  <Route
                    path="/article-writer/title-description"
                    element={
                      <ProtectedRoute>
                        <TitleDescriptionStep />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </ToastProvider>
          </SidebarProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
