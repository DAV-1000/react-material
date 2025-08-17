
// eslint-disable-next-line react-x/no-use-context
import { createContext, useContext } from 'react';
import { blogPostService, BlogPostService } from './BlogPostService';

// eslint-disable-next-line react-refresh/only-export-components
export const BlogPostServiceContext = createContext<BlogPostService | null>(null);

type BlogPostServiceProviderProps = {
  children: React.ReactNode;
}

export const BlogPostServiceProvider = ({ children }: BlogPostServiceProviderProps) => {
  return (
    <BlogPostServiceContext value={blogPostService}>
      {children}
    </BlogPostServiceContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components, react-x/no-use-context
export const useBlogPostService = () => useContext(BlogPostServiceContext);
