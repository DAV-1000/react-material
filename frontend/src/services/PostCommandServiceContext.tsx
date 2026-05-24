import { createContext, useContext } from 'react';

import { postCommandService, PostCommandService } from './PostCommandService';

// eslint-disable-next-line react-refresh/only-export-components
export const PostCommandServiceContext = createContext<PostCommandService | null>(null);

type PostCommandServiceProviderProps = {
  children: React.ReactNode;
}

export const PostCommandServiceProvider = ({ children }: PostCommandServiceProviderProps) => {
  return (
    <PostCommandServiceContext value={postCommandService}>
      {children}
    </PostCommandServiceContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePostCommandService = () => useContext(PostCommandServiceContext);
