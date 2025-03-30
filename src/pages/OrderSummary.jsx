import { useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Divider,
  Card,
  Steps,
  Typography,
  List,
  Avatar,
  Tag,
  message,
} from "antd";
import {
  ShoppingOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartData } from "../services/cart.service";
import { calculateTotals } from "../utils/calculateTotals";
import { formattedPrice } from "../utils/formattedPrice";
import RazorpayPayment from "../customComponents/RazorpayPayment";
import { getUserData } from "../services/user.service";
import { useAuth } from "../contexts/authContext";
import { getCurrentUser } from "../services/userAuth";
import toast from "react-hot-toast";

const { Title, Text } = Typography;
const { Step } = Steps;

const apiBaseUrl = import.meta.env.VITE_FIREBASE_API_BASEURL;

export const OrderSummary = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const { userLoggedIn, currentUser } = useAuth();

  const { mutateAsync: createCodOrder } = useMutation({
    mutationFn: async () => {
      const token = await getCurrentUser().getIdToken();
      return await fetch(apiBaseUrl + "/cod/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  const handleCashOnDelivery = async () => {
    await createCodOrder();
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    toast.success("Order placed successfully!");
    navigate("/orders");
  };

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserData(currentUser?.uid),
    enabled: userLoggedIn && !!currentUser?.uid,
  });

  // Fetch cart data
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartData,
  });

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading order information...
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error loading your order: {error.message}
      </div>
    );
  if (!cartData?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Title level={3}>Your cart is empty</Title>
        <Button
          type="primary"
          onClick={() => navigate("/products")}
          className="mt-4"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  // Calculate totals
  const totals = calculateTotals(cartData.items);

  const handleEditCart = () => {
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Steps current={currentStep}>
          <Step title="Cart" icon={<ShoppingOutlined />} />
          <Step title="Address" icon={<HomeOutlined />} />
          <Step title="Order Summary" icon={<FileTextOutlined />} />
        </Steps>
      </div>

      <Row gutter={[32, 32]}>
        {/* Left Column - Order Details */}
        <Col xs={24} lg={16}>
          <Card
            title={<Title level={4}>Order Summary</Title>}
            variant="borderless"
            className="mb-4"
          >
            <List
              itemLayout="horizontal"
              dataSource={cartData.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size={64} src={item.image} />
                    }
                    title={<Text strong>{item.name}</Text>}
                    description={
                      <div>
                        {item.size && (
                          <div className="mb-2">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700 mr-2">
                              Size: {item.size.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <Text>Quantity: {item.quantity}</Text>
                        <br />
                        <Text type="secondary">Unit Price: ₹{item.price}</Text>
                        <br />
                        <Text type="secondary">
                          Subtotal: ₹{item.price * item.quantity}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {userData ? (
            <Card
              title={<Title level={4}>Shipping Information</Title>}
              variant="borderless"
              className="mb-4"
            >
              <div>
                <Text strong>
                  {userData?.billing_customer_name}{" "}
                  {userData?.billing_last_name}
                </Text>
                <br />
                <Text>{userData?.billing_address}</Text>
                {userData?.billing_address_2 && (
                  <>
                    <br />
                    <Text>{userData?.billing_address_2}</Text>
                  </>
                )}
                <br />
                <Text>
                  {userData?.billing_city}, {userData?.billing_state}{" "}
                  {userData?.billing_pincode}
                </Text>
                <br />
                <Text>{userData?.billing_country}</Text>
                <br />
                <Text>
                  Phone: {userData?.billing_phone} | Email: {userData?.email}
                </Text>
              </div>
            </Card>
          ) : null}
        </Col>

        {/* Right Column - Price Summary */}
        <Col xs={24} lg={8}>
          <Card
            title={<Title level={4}>Price Details</Title>}
            variant="borderless"
            className="sticky top-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Price ({cartData.items.length} items)</Text>
                <Text>₹{totals.price}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Tax (GST)</Text>
                <Text>₹{totals.gst}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Delivery Charge</Text>
                <Text>₹{totals.shipping}</Text>
              </div>
              <Divider />
              <div className="flex justify-between">
                <Text strong>Total Amount</Text>
                <Text strong className="text-lg">
                  ₹{totals.totalPrice}
                </Text>
              </div>

              <div className="mt-8 space-y-4">
                <RazorpayPayment
                  cartData={cartData}
                  totalAmount={totals.totalPrice}
                />
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={handleCashOnDelivery}
                  icon={<CheckCircleOutlined />}
                >
                  Cash on Delivery
                </Button>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={handleEditCart}
                >
                  Edit Cart
                </Button>
              </div>

              <div className="mt-4">
                <Tag color="green">Free delivery for orders above ₹499</Tag>
                <Tag color="blue">Secure checkout</Tag>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>
                  By proceeding to checkout, you agree to our terms of service
                  and privacy policy.
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
