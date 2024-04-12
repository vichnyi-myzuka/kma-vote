import { createContext } from 'react';

export type PageLoaderContextType = {
  showPageLoader: () => void;
  hidePageLoader: () => void;
};

export const PageLoaderContext = createContext<PageLoaderContextType>({
  showPageLoader: () => {},
  hidePageLoader: () => {},
});
