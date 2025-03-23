import { useState } from "react";
import { AddressForm } from "../customComponents/AddressForm/AddressForm";
import { Steps } from "antd";
import {
  FileTextOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

export const Address = () => {
  const { Step } = Steps;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
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

  // Example initial values
  const initialValues = {
    billing_customer_name: "Naruto",
    billing_last_name: "Uzumaki",
    billing_address: "House 221B, Leaf Village",
    billing_address_2: "Near Hokage House",
    billing_city: "New Delhi",
    billing_pincode: "110002",
    billing_state: "Delhi",
    billing_country: "India",
    billing_email: "naruto@uzumaki.com",
    billing_phone: "9876543210",
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
        initialValues={initialValues}
        loading={loading}
      />
    </div>
  );
};
