import './App.css';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Order from './pages/Order';
import User from './pages/User';
import Login from './pages/Login';
import Register from './pages/Register';
import Page404 from './pages/404';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order" element={<Order />} />
          <Route
            path="/product-detail/:productId/:producturl"
            element={<ProductDetail />}
          />
          <Route path="/products/:routeParameter?" element={<Products />} />
          <Route
            path="/products/:routeParameter/:routeParameter2?"
            element={<Products />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
