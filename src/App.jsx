import "./App.css";
import { Home } from "./pages/Home";
import { PrimaryNav } from "./components/Nav/PrimaryNav";
import { Navbar } from "./components/Nav/Navbar";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { CustomFooter } from "./components/Footer/Footer";
import { Orders } from "./pages/Orders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const routesArray = [
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
      path: "/orders",
      element: <Orders />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PrimaryNav />
        <Navbar />
        <div>{routesElement}</div>
        <CustomFooter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
