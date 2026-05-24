
import { createContext, useContext } from 'react';
import { postQueryService, PostQueryService } from './PostQueryService';

// eslint-disable-next-line react-refresh/only-export-components
export const PostQueryServiceContext = createContext<PostQueryService | null>(null);

type PostQueryServiceProviderProps = {
  children: React.ReactNode;
}

export const PostQueryServiceProvider = ({ children }: PostQueryServiceProviderProps) => {
  return (
    <PostQueryServiceContext value={postQueryService}>
      {children}
    </PostQueryServiceContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePostQueryService = () => useContext(PostQueryServiceContext);
