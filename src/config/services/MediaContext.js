import { createContext, useContext } from 'react';

const MediaContext = createContext();

export function useMediaContext() {
  return useContext(MediaContext);
}

export default MediaContext;
// import { useMediaContext } from '../config/services/MediaContext';
// const { isDesktop, isTablet, isMobile } = useMediaContext();
// if(isDesktop){} else if (isTablet){} else if (isMobile){} else{return;}
// if(isDesktop || isTablet){} else if (isMobile){} else{return;}
