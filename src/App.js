import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import CreateRoutes from './config/CreateRoutes';
import Token from './config/services/Token';
import Header from './components/Header';
import Footer from './components/Footer';
import MediaContext from './config/services/MediaContext';
import ThemeContext from './config/services/ThemeContext';
import RESTapi from './config/services/RESTapi';

function App() {
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1279px)',
  });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const [role, setRole] = useState(Token.getRole()); // Initial state set to null
  const [shareState, setShareState] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('isDarkMode') === 'true'
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevIsDarkMode) => {
      localStorage.setItem('isDarkMode', !prevIsDarkMode);
      return !prevIsDarkMode;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (role === 'guest') {
      setIsLoaded(true);
      return;
    } else {
      async function handleAuthentication() {
        try {
          const authData = await RESTapi.fetchCheckAuthen();
          setIsLoaded(true);
          if (authData && authData.isAuthen === false) {
            setShareState((prevState) => prevState + 1);
          }
        } catch (error) {
          setRole('guest');
          console.error('Error occurred while checking authentication:', error);
        }
      }
      handleAuthentication();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded) {
    return <></>;
  }
  return (
    <BrowserRouter>
      <MediaContext.Provider value={{ isDesktop, isTablet, isMobile }}>
        <ThemeContext.Provider value={{ toggleTheme }}>
          <Header role={role} shareState={shareState} />
          <CreateRoutes
            role={role}
            setRole={setRole}
            shareState={shareState}
            setShareState={setShareState}
          />
          <Footer role={role} />
        </ThemeContext.Provider>
      </MediaContext.Provider>
    </BrowserRouter>
  );
}

export default App;

// {/* <Routes>
// <Route path="/" element={<Home />} />
// <Route path="/cart" element={<Cart />} />
// <Route path="/order" element={<Order />} />
// <Route
//   path="/product-detail/:productId/:producturl"
//   element={<ProductDetail />}
// />
// <Route
//   path="/products/:routeParameter?/:routeParameter2?"
//   element={<Products />}
// />
// <Route path="/user" element={<User />} />
// <Route path="/login" element={<Login />} />
// <Route path="/register" element={<Register />} />
// <Route path="/*" element={<Page404 />} />
// </Routes> */}
