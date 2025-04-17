
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags: string[];
  translations?: {
    [key: string]: {
      title: string;
      excerpt: string;
      category: string;
    }
  };
}

export interface TranslatedBlogPost extends Omit<BlogPost, 'title' | 'excerpt' | 'category'> {
  title: string;
  excerpt: string;
  category: string;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';
