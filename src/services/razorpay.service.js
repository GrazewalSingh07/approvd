import api from '../../axios.config.js'

export const createOrder = async (payload) => {
  try {
    return await api.post("/razorpay/create-order", payload)
  } catch (error) {
    console.log(error)
  }
}

export const verifyPayment = async (payload) => {
  try {
    return api.post("/razorpay/verify-payment", payload)
  }
  catch (error) {
    console.log(error)
  }
}
