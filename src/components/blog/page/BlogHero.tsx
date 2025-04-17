
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BlogHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  "All Categories",
  "AI Technology",
  "SEO",
  "Content Strategy",
  "Case Studies",
  "Content Ethics",
  "Tutorials"
];

const BlogHero: React.FC<BlogHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container-wide">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Insights & Resources
        </h1>
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center mb-10">
          The latest strategies, guides, and insights on AI content creation and SEO optimization.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
