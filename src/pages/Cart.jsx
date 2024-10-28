import React, { useEffect, useState } from 'react';
import { getCartData, updateCartItem, removeCartItem } from "../services/cartService";
import { Button, Row, Col, Collapse } from 'antd';
import useWindowSize from '../hooks/useBreakpoints';
import { ArrowRightOutlined } from '@ant-design/icons';
import RazorpayPayment from '../customComponents/RazorpayPayment';
 

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const size = useWindowSize(); // Get screen size using the custom hook
  const [totalPrice, setTotalPrice] = useState(0);
 
const { Panel } = Collapse;
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartData();
        setCartItems(items); // Set the cart items in the state
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();
  }, []);
  useEffect(() => {
    calculateTotalPrice(cartItems); 
  },[cartItems])

  const calculateTotalPrice = (items) => {
    
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total); // Set the calculated total price in state
  };

  // Function to handle quantity increment
  const handleIncrement = async (item) => {
    await updateCartItem(item, 1); // Increase quantity by 1
    // Refetch cart data
    const items = await getCartData();
    setCartItems(items);
     
  };

   
  const handleDecrement = async (item) => {
    await updateCartItem(item, -1);  
    
    const items = await getCartData();
    setCartItems(items);
    
  };

  // Function to handle item removal
  const handleRemove = async (item) => {
    await removeCartItem(item); // Remove item from cart
    // Refetch cart data
    const items = await getCartData();
    setCartItems(items);
    
  };

  // Dynamic style based on window size
  const getStyles = () => {
    if (size === 'xs' || size === 'sm') {
      return {
        cartTotalRemove: {
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
        },
      };
    } else {
      return {
        cartTotalRemove: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        },
      };
    }
  };

  const styles = getStyles(); 
  const [couponDiscount, setCouponDiscount] = useState(0);  
  const [deliveryCharge, setDeliveryCharge] = useState(50); // Set your delivery charge
  
  // Function to calculate total with coupon and delivery charge
  const calculateFinalTotal = () => {
    let discountedAmount = totalPrice - (totalPrice * couponDiscount / 100);
    let finalAmount = discountedAmount + deliveryCharge;
    return finalAmount;
  };
  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                marginBottom: '16px',
              }}
            >
              <Row gutter={[16, 16]}  >
                {/* First Column: Image */}
                 
                <Col  xs={8} style={{ textAlign: 'center' }}>
                  <div style={{ maxHeight:'120px', overflow: 'hidden' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                </Col>

                {/* Second Column: Name, Price, Quantity */}
                <Col  xs={16} >
                  <p className='text-black '>{item.name}</p>
                  <p style={{ color: '#555' }}>Price: ₹{item.price}</p>
                  <p style={{ color: '#555' }}>Quantity: {item.quantity}</p>
                  <div style={{ display: 'flex', marginTop: '8px' }}>
                    <Button onClick={() => handleDecrement(item)} style={{ marginRight: '8px' }}>-</Button>
                    <Button onClick={() => handleIncrement(item)}>+</Button>
                  </div>
                </Col>
               

                {/* Third Column: Remove button */}
                <Col xs={24} sm={6}>
                  <div style={styles.cartTotalRemove}>
                    <Button
                      onClick={() => handleRemove(item)}
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        width: size === 'xs' || size === 'sm' ? '100%' : 'auto',
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
           
           <div  className='my-4' style={{  textAlign: 'right' }}>
           <Collapse   style={{ marginTop: '16px' }}>
            <Panel header={<span style={{ color: 'black' }}>Price Breakdown <ArrowRightOutlined/></span>} key="1">
              <p>Total Price: ₹{totalPrice}</p>
              <p>Coupon Discount: {couponDiscount}%</p>
              <p>Delivery Charge: ₹{deliveryCharge}</p>
              <p>Final Total: ₹{calculateFinalTotal()}</p>
            </Panel>
          </Collapse>
           
          </div>
         <div className='text-right'>  <RazorpayPayment totalAmount={calculateFinalTotal()}/>
         </div> 
        </div>
      )}

    </div>
  );
};
