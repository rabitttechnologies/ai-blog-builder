
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple markdown parser for headers, lists, and paragraphs
  const parseMarkdown = (markdown: string): JSX.Element => {
    const lines = markdown.split('\\n').join('\n').split('\n');
    
    return (
      <>
        {lines.map((line, index) => {
          // Headers
          if (line.startsWith('##')) {
            const level = line.match(/^#{2,6}/)?.[0].length || 2;
            const text = line.replace(/^#{2,6}\s*/, '');
            
            switch (level) {
              case 2:
                return <h2 key={index} className="text-xl font-semibold my-2">{text}</h2>;
              case 3:
                return <h3 key={index} className="text-lg font-medium my-2">{text}</h3>;
              case 4:
                return <h4 key={index} className="text-base font-medium my-1">{text}</h4>;
              case 5:
                return <h5 key={index} className="text-sm font-medium my-1">{text}</h5>;
              default:
                return <h6 key={index} className="text-xs font-medium my-1">{text}</h6>;
            }
          }
          
          // Unordered lists
          if (line.trim().startsWith('- ')) {
            const text = line.trim().substring(2);
            return <li key={index} className="ml-4 list-disc">{text}</li>;
          }
          
          // Empty lines
          if (!line.trim()) {
            return <div key={index} className="h-2"></div>;
          }
          
          // Regular paragraphs
          return <p key={index} className="my-1">{line}</p>;
        })}
      </>
    );
  };
  
  return (
    <div className="markdown-content">
      {parseMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;
