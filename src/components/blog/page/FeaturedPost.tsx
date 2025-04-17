
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface FeaturedPostProps {
  post: BlogPost;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 glass p-6 rounded-xl">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="badge badge-primary mb-4">Featured</div>
            <h2 className="text-3xl font-bold mb-4">
              <a href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                {post.title}
              </a>
            </h2>
            <p className="text-foreground/70 text-lg mb-6">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Tag className="h-4 w-4" />
                <span>{post.category}</span>
              </div>
            </div>
            <Button onClick={() => navigate(`/blog/${post.id}`)}>
              Read Article <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPost;
