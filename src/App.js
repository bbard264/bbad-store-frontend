import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CreateRoutes from './config/CreateRoutes';
import Token from './config/services/Token';
import RESTapi from './config/services/RESTapi';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [role, setRole] = useState(Token.getRole()); // Initial state set to null

  console.log(role);
  useEffect(() => {
    RESTapi.fetchCheckAuthen();
  }, []);

  return (
    <BrowserRouter>
      <Header role={role} />
      <CreateRoutes role={role} setRole={setRole} />
      <Footer role={role} />
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
