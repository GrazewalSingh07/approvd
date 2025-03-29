import Home from "./pages/Home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Orders } from "./pages/Orders";
import { Address } from "./pages/Address";
import { OrderSummary } from "./pages/OrderSummary";
import { Profile } from "./pages/UserProfile";
import { ErrorPage } from "./components/ErrorPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
    element:  <ProtectedRoute><Profile /></ProtectedRoute>,
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
    element: <ProtectedRoute><Cart /></ProtectedRoute>,
  },
  {
    path: "/address",
    element: <ProtectedRoute><Address /></ProtectedRoute>,
  },
  {
    path: "/orders",
    element: <ProtectedRoute><Orders /></ProtectedRoute>,
  },
  {
    path: "/order-summary",
    element: <ProtectedRoute><OrderSummary /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];
