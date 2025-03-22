import { Button, Row, Col, Collapse } from "antd";
import useWindowSize from "../hooks/useBreakpoints";
import { ArrowRightOutlined } from "@ant-design/icons";
import RazorpayPayment from "../customComponents/RazorpayPayment";
import { calculateTotals } from "../utils/calculateTotals";
import { useQuery } from "@tanstack/react-query";
import {
  getCartData,
  updateCartItem,
  removeCartItem,
} from "../services/cart.service";

export const Cart = () => {
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
    <div style={{ padding: "16px" }}>
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

                <Col xs={8} style={{ textAlign: "center" }}>
                  <div style={{ maxHeight: "120px", overflow: "hidden" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </Col>

                {/* Second Column: Name, Price, Quantity */}
                <Col xs={16}>
                  <p className="text-black ">{item.name}</p>
                  <p style={{ color: "#555" }}>Price: ₹{item.price}</p>
                  <p style={{ color: "#555" }}>Quantity: {item.quantity}</p>
                  <div style={{ display: "flex", marginTop: "8px" }}>
                    <Button
                      onClick={() => changeQuantity(item, -1)}
                      style={{ marginRight: "8px" }}
                    >
                      -
                    </Button>
                    <Button onClick={() => changeQuantity(item, 1)}>+</Button>
                  </div>
                </Col>

                {/* Third Column: Remove button */}
                <Col xs={24} sm={6}>
                  <div style={styles.cartTotalRemove}>
                    <Button
                      onClick={() => handleRemove(item)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        width: size === "xs" || size === "sm" ? "100%" : "auto",
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          ))}

          <div className="my-4" style={{ textAlign: "right" }}>
            <Collapse style={{ marginTop: "16px" }} items={[collapseContent]} />
          </div>
          <div className="text-right">
            {" "}
            <RazorpayPayment cartData={cartItems} totalAmount={totalPrice()} />
          </div>
        </div>
      )}
    </div>
  );
};
