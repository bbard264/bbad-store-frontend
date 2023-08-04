import { createContext, useContext } from 'react';

const MediaContext = createContext();

export function useMediaContext() {
  return useContext(MediaContext);
}

export default MediaContext;
