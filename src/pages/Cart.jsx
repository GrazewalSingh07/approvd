import { Button, Row, Col, Collapse } from "antd";
import useWindowSize from "@/hooks/useBreakpoints";
import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import RazorpayPayment from "../customComponents/RazorpayPayment";
import { calculateTotals } from "@/utils/calculateTotals";
import { useQuery } from "@tanstack/react-query";
import { Steps } from "antd";
import { useNavigate } from "react-router";
import {
  FileTextOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  getCartData,
  updateCartItem,
  removeCartItem,
} from "../services/cart.service";
import { InputNumber } from "antd";
import { Card } from "antd";
import { Typography } from "antd";

export const Cart = () => {
  const navigate = useNavigate();
  const { Step } = Steps;
  const { Title } = Typography;
  const size = useWindowSize(); // Get screen size using the custom hook
  const { data: cartItems, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartData,
  });

  const changeQuantity = async (item, quantity) => {
    await updateCartItem(item, quantity);
    refetch();
  };

  const handleRemove = async (item) => {
    await removeCartItem(item);
    refetch();
  };

  const proceedToCheckout = () => {
    navigate("/address");
  };

  const price = () => calculateTotals(cartItems?.items)?.price;
  const totalPrice = () => calculateTotals(cartItems?.items)?.totalPrice;
  const gst = () => calculateTotals(cartItems?.items)?.gst;
  const shipping = () => calculateTotals(cartItems?.items)?.shipping;

  const collapseContent = {
    key: "1",
    label: (
      <span style={{ color: "black" }}>
        Price Breakdown <ArrowRightOutlined />
      </span>
    ),
    children: (
      <>
        <p>Total Price: ₹{price()}</p>
        <p>Tax ( GST ): {gst()}</p>
        <p>Delivery Charge: ₹{shipping()}</p>
        <p>Final Total: ₹{totalPrice()}</p>
      </>
    ),
  };

  // Dynamic style based on window size
  const getStyles = () => {
    if (size === "xs" || size === "sm") {
      return {
        cartTotalRemove: {
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
        },
      };
    } else {
      return {
        cartTotalRemove: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        },
      };
    }
  };

  const styles = getStyles();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Steps current={0}>
          <Step title="Cart" icon={<ShoppingOutlined />} />
          <Step title="Address" icon={<HomeOutlined />} />
          <Step title="Order Summary" icon={<FileTextOutlined />} />
        </Steps>
      </div>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Your Cart</h2>

      {!cartItems?.items?.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems?.items?.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                marginBottom: "16px",
              }}
            >
              <Row gutter={[16, 16]}>
                {/* First Column: Image */}

                <Col xs={8} sm={6} md={4} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      aspectRatio: "1/1",
                      width: "100%",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      loading="lazy"
                    />
                  </div>
                </Col>

                {/* Second Column: Name, Price, Quantity */}
                <Col xs={16}>
                  <div className="flex flex-col h-full">
                    <div>
                      <p className="text-black font-medium text-base md:text-lg mb-1">
                        {item.name}
                      </p>
                      {item.size && (
                        <div className="mb-2">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700 mr-2">
                            Size: {item.size.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm mb-1">
                        Price: ₹{item.price}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center">
                        <Button
                          onClick={() => changeQuantity(item, -1)}
                          disabled={item.quantity <= 1}
                          className="flex items-center justify-center border border-gray-300 rounded-l-md h-8 w-8 hover:bg-gray-100"
                          style={{ margin: 0, padding: 0 }}
                        >
                          <span className="text-lg">-</span>
                        </Button>

                        <div
                          className="flex items-center justify-center h-8 px-3 border-t border-b border-gray-300 bg-white"
                          style={{ minWidth: "40px" }}
                        >
                          <span className="text-sm font-medium">
                            {item.quantity}
                          </span>
                        </div>

                        <Button
                          onClick={() => changeQuantity(item, 1)}
                          className="flex items-center justify-center border border-gray-300 rounded-r-md h-8 w-8 hover:bg-gray-100"
                          style={{ margin: 0, padding: 0 }}
                        >
                          <span className="text-lg">+</span>
                        </Button>

                        <Button
                          onClick={() => handleRemove(item)}
                          className="ml-3 h-8 flex items-center justify-center"
                          icon={<DeleteOutlined className="text-black" />}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))}

          <div className="my-6">
            <Card
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              title={<Title level={4}>Price Breakdown</Title>}
            >
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{price()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (GST):</span>
                    <span className="font-medium">₹{gst()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Charge:</span>
                    <span className="font-medium">₹{shipping()}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-black">
                      ₹{totalPrice()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-right mt-6">
            <Button
              size="large"
              color="default"
              variant="solid"
              onClick={proceedToCheckout}
              className="px-6"
              icon={<ArrowRightOutlined />}
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
