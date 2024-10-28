 
import './App.css'
 
import { Home } from './pages/Home'
import { PrimaryNav } from './components/Nav/PrimaryNav'
 
import { Navbar } from './components/Nav/Navbar'
 


import Login from "./components/auth/login";
import Register from "./components/auth/register";
 
 

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { CustomFooter } from './components/Footer/Footer';

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
    }, {
      path: "/cart",
      element: <Cart />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
     <PrimaryNav/>
     <Navbar/>
      <div>{routesElement}</div>
      <CustomFooter/>
    </AuthProvider>
  );
}

export default App;
