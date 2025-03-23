import "./App.css";
import { PrimaryNav } from "./components/Nav/PrimaryNav";
import { Navbar } from "./components/Nav/Navbar";
import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router";
import { CustomFooter } from "./components/Footer/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routesArray } from "./routes";

const queryClient = new QueryClient();

function App() {
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
