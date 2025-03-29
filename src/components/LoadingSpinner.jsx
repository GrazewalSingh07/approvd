import { Spin } from "antd";
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8 min-h-[60vh]">
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;
