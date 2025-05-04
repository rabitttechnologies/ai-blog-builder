
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ArticleWriterProvider } from './context/articleWriter/ArticleWriterContext';
import ArticleWriterOverview from './pages/ArticleWriter/ArticleWriterOverview';
import TitleDescriptionStep from './pages/ArticleWriter/TitleDescriptionStep';

function App() {
  return (
    <ArticleWriterProvider>
      <Routes>
        <Route path="/" element={<ArticleWriterOverview />} />
        <Route path="/article-writer" element={<ArticleWriterOverview />} />
        <Route path="/article-writer/title-description" element={<TitleDescriptionStep />} />
      </Routes>
      <Toaster />
    </ArticleWriterProvider>
  );
}

export default App;
