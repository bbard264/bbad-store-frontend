import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Order from '../pages/Order';
import User from '../pages/User';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Page404 from '../pages/404';
import Favorite from '../pages/Favorite';

const components = {
  home: {
    url: '/',
    component: Home,
  },
  products: {
    url: '/products/:routeParameter?/:routeParameter2?',
    component: Products,
  },
  productDetail: {
    url: '/product-detail/:productId/:product_url_name?',
    component: ProductDetail,
  },
  cart: {
    url: '/cart/reviewCheckOut?',
    component: Cart,
  },
  order: {
    url: '/order',
    component: Order,
  },
  user: {
    url: '/user/:page?',
    component: User,
  },
  login: {
    url: '/login',
    component: Login,
  },
  register: {
    url: '/register',
    component: Register,
  },
  favorite: {
    url: '/favorite',
    component: Favorite,
  },
  page404: {
    url: '/404',
    component: Page404,
  },
};

// Which Role can access what?
const routesConfig = {
  route: {
    publicRoutes: [
      components.home,
      components.products,
      components.productDetail,
      components.page404,
    ],
    privateRoutes: [
      components.login,
      components.register,
      components.cart,
      components.order,
      components.user,
      components.favorite,
    ],
    redirectRoute: '/',
  },
  role: {
    guest: {
      allowedRoutes: [components.login, components.register],
      redirectRoute: '/login',
    },
    user: {
      allowedRoutes: [
        components.cart,
        components.order,
        components.user,
        components.favorite,
      ],
      redirectRoute: '/',
    },
  },
};

export default routesConfig;
