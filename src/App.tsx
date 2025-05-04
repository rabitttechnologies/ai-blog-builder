
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ArticleWriterProvider } from './context/articleWriter/ArticleWriterContext';
import ArticleWriterOverview from './pages/ArticleWriter/ArticleWriterOverview';
import TitleDescriptionStep from './pages/ArticleWriter/TitleDescriptionStep';

function App() {
  return (
    <ArticleWriterProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ArticleWriterOverview />} />
          <Route path="/article-writer" element={<ArticleWriterOverview />} />
          <Route path="/article-writer/title-description" element={<TitleDescriptionStep />} />
        </Routes>
        <Toaster />
      </Router>
    </ArticleWriterProvider>
  );
}

export default App;
