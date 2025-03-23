import { Home } from "./pages/Home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Orders } from "./pages/Orders";
import { Address } from "./pages/Address";
import { OrderSummary } from "./pages/OrderSummary";
import { Profile } from "./pages/UserProfile";

export const routesArray = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/detail",
    element: <ProductDetail />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/address",
    element: <Address />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/order-summary",
    element: <OrderSummary />,
  },
];
