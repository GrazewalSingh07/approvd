import axios from "axios";

const shiprocketBaseUrl = process.env.SHIPROCKET_BASE_URL;

let shiprocketToken = null;
const getShiprocketAuthToken = async () => {
  // return the token if it exists and is not expired
  if (shiprocketToken && shiprocketToken.expiry > Date.now()) {
    return shiprocketToken.token;
  }
  const response = await axios.post(shiprocketBaseUrl + "/auth/login", {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  // set the token and expiry time
  shiprocketToken = {
    token: response.data.token,
    expiry: Date.now() + 9 * 24 * 60 * 60 * 1000,
  };
  return shiprocketToken.token;
};

export const createShiprocketOrder = async (orderData) => {
  try {
    const shiprocketToken = await getShiprocketAuthToken();
    const response = await axios.post(
      shiprocketBaseUrl + "/orders/create/adhoc",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${shiprocketToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Order created successfully:", response.data);
  } catch (error) {
    console.error("Error creating Shiprocket order:", error);
  }
};

export const trackShiprocketShipment = async (trackingId) => {
  try {
    const token = await getShiprocketAuthToken();
    const response = await axios({
      method: "get",
      url: shiprocketBaseUrl + `/courier/track/awb/${trackingId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error tracking Shiprocket shipment:", error);
    throw error;
  }
};
