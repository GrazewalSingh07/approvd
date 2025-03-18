import axios from 'axios';

const getShiprocketAuthToken = async () => {
  const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: 'your_shiprocket_email',
    password: 'your_shiprocket_password',
  });
  return response.data.token;
};

export const createShiprocketOrder = async (orderData) => {
  try {
    const shiprocketToken = await getShiprocketAuthToken();
    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create',
      orderData,
      {
        headers: {
          Authorization: `Bearer ${shiprocketToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

