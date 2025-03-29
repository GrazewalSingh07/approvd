import { Button } from "antd";

export const  ErrorPage = () => {
  return (
  <div className="text-center max-w-md mx-auto p-6 bg-white">
    <h1 className="text-9xl font-bold">404</h1>
    <h2 className="text-3xl font-semibold text-gray-800 mt-4">Oops! Page Not Found</h2>
    <p className="text-gray-600 mt-2">
      The page you are looking for is not found. Please check the URL and try again.
    </p>
    <div className="flex justify-center gap-4 mt-6">
      <Button size="large"
              color="default">
        Go Back to Home
      </Button>
    </div>
  </div>
  );
}
