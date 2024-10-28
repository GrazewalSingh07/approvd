import React, { useState } from 'react';
import { Button, message } from 'antd';

const RazorpayPayment = ({ totalAmount }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
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
      message.error('Failed to load Razorpay SDK. Please check your connection.');
      setLoading(false);
      return;
    }

    // Call Firebase Cloud Function to create a new order
    const result = await fetch(
      'https://approvd-41bd1.cloudfunctions.net/createOrder', // Replace with your Firebase Cloud Function URL
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount }), // Send the amount to Cloud Function
      }
    ).then((res) => res.json());

    if (!result) {
      message.error('Server error. Please try again later.');
      setLoading(false);
      return;
    }

    const { amount, id: order_id, currency } = result;

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay API Key
      amount: amount.toString(),
      currency: currency,
      name: 'Your Company Name',
      description: 'Test Transaction',
      order_id: order_id, // This is the order ID created by Razorpay
      handler: function (response) {
        // Handle the payment success
        message.success('Payment successful!');
        console.log(response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={handlePayment} loading={loading}>
      Proceed to payment | Total Price: ₹{totalAmount}
      </Button>
    </div>
  );
};

export default RazorpayPayment;
