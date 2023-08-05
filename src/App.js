import './App.css';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import CreateRoutes from './config/CreateRoutes';
import CartStorage from './config/services/CartStorage';
import Token from './config/services/Token';
import Header from './components/Header';
import Footer from './components/Footer';
import MediaContext from './config/services/MediaContext';

function App() {
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1279px)',
  });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const [role, setRole] = useState(Token.getRole()); // Initial state set to null
  const [shareState, setShareState] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((p) => !p);

    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
    }
  };

  return (
    <BrowserRouter>
      <MediaContext.Provider value={{ isDesktop, isTablet, isMobile }}>
        <button onClick={toggleTheme} className="changeTheme">
          Change to Dark
        </button>
        <Header role={role} shareState={shareState} />
        <CreateRoutes
          role={role}
          setRole={setRole}
          shareState={shareState}
          setShareState={setShareState}
        />
        <Footer role={role} />
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
