import { useState } from "react";
import { AddressForm } from "@/customComponents/AddressForm/AddressForm";
import { Steps } from "antd";
import {
  FileTextOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { getUserData, updateUserDetails } from "@/services/user.service";
import { useAuth } from "@/contexts/authContext";
import { useQuery } from "@tanstack/react-query";

export const Address = () => {
  const { Step } = Steps;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userLoggedIn, currentUser } = useAuth();

  const {
    data: userData,
    isLoading: userLoading,
    isSuccess: userSuccess,
    error: userError,
  } = useQuery({
    queryKey: ["user", currentUser?.uid],
    queryFn: () => getUserData(currentUser?.uid),
    enabled: !!userLoggedIn && !!currentUser?.uid,
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (userLoggedIn) {
        await updateUserDetails(currentUser.uid, values);
      }
      // Save the billing information to your backend
      // await saveBillingInfo(values);
      // Show success message or redirect
      navigate("/order-summary");
    } catch (error) {
      // Handle error
      console.error("Failed to save billing information:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Steps current={1}>
          <Step title="Cart" icon={<ShoppingOutlined />} />
          <Step title="Address" icon={<HomeOutlined />} />
          <Step title="Order Summary" icon={<FileTextOutlined />} />
        </Steps>
      </div>
      <AddressForm
        onSubmit={handleSubmit}
        initialValues={userData}
        loading={loading}
      />
    </div>
  );
};
