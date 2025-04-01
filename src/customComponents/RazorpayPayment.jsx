import React, { useState } from "react";
import { Button } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { updateCart } from "../services/cart.service";
import { createOrder, verifyPayment } from "../services/razorpay.service";

const RazorpayPayment = ({ totalAmount }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.dismiss();
      toast.error("Failed to load Razorpay SDK. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const result = await createOrder({ amount: totalAmount })
      const { amount, id: order_id, currency } = result?.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_TEST_KEY_ID,
        amount: amount.toString(),
        currency,
        name: "Approvd",
        description: "Test Transaction",
        order_id,
        handler: async function(response) {
          await updateCart(response);
          const verifyResponse = await verifyPayment(response);
          if (verifyResponse.status === 200) {
            toast.success("Payment verified successfully");
            navigate("/");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log(error, "error");
      toast.dismiss();
      toast.error("Server error. Please try again later.");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handlePayment}
        color="default"
        variant="solid"
      >
        Pay Now
      </Button>
    </>
  );
};

export default RazorpayPayment;
