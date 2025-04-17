
import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BlogPost } from '@/types/blog';

interface BlogGridProps {
  posts: BlogPost[];
  onLoadMore: () => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts, onLoadMore }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-4">No articles found</h3>
        <p className="text-foreground/70 mb-6">Try adjusting your search or filter criteria</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="glass rounded-xl overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-primary rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-foreground/60 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  <a href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </a>
                </h3>
                <p className="text-foreground/70 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/60">
                    {post.date} • {post.author}
                  </span>
                  <a 
                    href={`/blog/${post.id}`} 
                    className="text-primary font-medium text-sm flex items-center hover:text-primary/80 transition-colors"
                  >
                    Read more <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={onLoadMore}>
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
