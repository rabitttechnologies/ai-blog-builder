
import { Database } from "@/integrations/supabase/types";

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  // Additional fields for backward compatibility with existing UI
  date?: string;
  readTime?: string;
  category?: string;
  image?: string;
  translations?: Record<string, BlogTranslation>;
};

export type BlogTranslation = {
  title: string;
  excerpt: string;
  category: string;
};

export type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];
export type BlogPostUpdate = Database["public"]["Tables"]["blog_posts"]["Update"];

export type TranslationWorkflow = Database["public"]["Tables"]["translation_workflows"]["Row"];
export type TranslationWorkflowInsert = Database["public"]["Tables"]["translation_workflows"]["Insert"];
export type TranslationWorkflowUpdate = Database["public"]["Tables"]["translation_workflows"]["Update"];

export type BlogPostStatus = Database["public"]["Enums"]["blog_post_status"];
export type TranslationStatus = Database["public"]["Enums"]["translation_status"];
