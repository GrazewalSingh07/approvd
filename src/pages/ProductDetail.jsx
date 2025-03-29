import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { useLocation, useNavigate } from "react-router";
import {
  Button,
  Carousel,
  Divider,
  Flex,
  Space,
  Tag,
  Skeleton,
  Rate,
  Tabs,
  Typography,
  notification,
  Badge,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  RollbackOutlined,
  StarFilled,
} from "@ant-design/icons";
import { QuantityCounter } from "../customComponents/QuantityCounter";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, getCartData } from "../services/cart.service";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("id");

  const fetchProductDetails = async () => {
    if (productId) {
      try {
        const productDoc = doc(db, "products", productId);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
          return { ...productSnapshot.data(), id: productSnapshot.id };
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      }
    }
  };

  const { data: cartItems } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartData,
  });

  const isProductInCart = () => {
    if (!cartItems?.items?.length || !productId) return false;
    return cartItems.items.some((item) => item.id === productId);
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: fetchProductDetails,
  });

  const { mutate, isLoading: isAddingToCart } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Product added to cart");
      notification.success({
        message: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        placement: "topRight",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const fetchSimilarProducts = async () => {
    const category = product?.category;
    if (category) {
      const productCollection = collection(db, "products");
      const q = query(productCollection, where("category", "==", category));
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return productList;
    }
  };

  const {
    data: similarProducts,
    isLoading: isLoadingSimilar,
    error: errorSimilar,
  } = useQuery({
    queryKey: ["similar", product?.category],
    queryFn: fetchSimilarProducts,
    enabled: !!product?.category,
  });

  useEffect(() => {
    console.log("similarProducts", similarProducts, product);
  }, [similarProducts]);

  const handleAddToCart = async () => {
    toast.dismiss();
    if (!currentUser) {
      toast.error("Please log in to add items to the cart");
      return;
    }

    if (product.size && product.size.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const cartItem = {
      id: productId,
      name: product.name,
      price: product.price,
      quantity: quantity,
      totalPrice: product.price * quantity,
      image: product.images[0],
      size: selectedSize,
    };
    mutate(cartItem);
  };

  const similarProductClick = (id) => {
    if (!id) return;
    navigate(`/products/detail?id=${id}`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const discount = product
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton.Image className="w-full h-[500px]" active />
          <div>
            <Skeleton active paragraph={{ rows: 6 }} />
            <div className="mt-6">
              <Skeleton.Button
                active
                size="large"
                shape="default"
                block={true}
              />
              <Skeleton.Button
                className="mt-4"
                active
                size="large"
                shape="default"
                block={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <InfoCircleOutlined style={{ fontSize: 48, color: "#ccc" }} />
        <Title level={3} className="mt-4">
          Product Not Found
        </Title>
        <Text type="secondary">
          The product you're looking for doesn't exist or has been removed.
        </Text>
        <br />
        <Button
          icon={<RollbackOutlined />}
          type="primary"
          className="mt-6"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Product Images */}
        <div className="relative">
          <Carousel
            className="bg-gray-50 rounded-lg overflow-hidden"
            autoplay
            dots={true}
            effect="fade"
          >
            {product?.images?.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden">
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Right Column - Product Info */}
        <div className="px-0 md:px-8">
          <div className="mb-6">
            {product.category && (
              <Text
                type="secondary"
                className="text-sm uppercase tracking-wider"
              >
                {product.category} / {product.type}
              </Text>
            )}
            <Title level={2} className="mt-1 mb-4">
              {product.name}
            </Title>

            <div className="flex items-baseline space-x-2 mb-1">
              <Text className="text-2xl font-bold">₹{product.price} INR</Text>
              <Text className="text-lg text-gray-500 line-through">
                ₹{product.originalPrice} M.R.P
              </Text>
            </div>
            <Text type="secondary" className="block mb-6">
              {"(Inclusive of all taxes)"}
            </Text>

            {discount > 0 && (
              <Tag color="green" className="mb-4 text-sm">
                <CheckCircleOutlined /> You save ₹
                {product.originalPrice - product.price} ({discount}% off)
              </Tag>
            )}
          </div>

          <Divider />

          {/* Size Selection */}
          {product?.size && product.size.length > 0 && (
            <div className="mb-6">
              <Text strong className="text-lg mb-3 block">
                Size:
              </Text>
              <Flex wrap="wrap" gap="small">
                {product.size.map((size) => (
                  <Button
                    key={size}
                    className={`capitalize px-4 ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-transparent text-black border-gray-300"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size.toUpperCase()}
                  </Button>
                ))}
              </Flex>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <Text strong className="text-lg mb-3 block">
              Quantity:
            </Text>
            <QuantityCounter quantity={quantity} setQuantity={setQuantity} />
          </div>

          {/* Add to Cart & Buy Now / Go to Cart Buttons */}
          {isProductInCart() ? (
            <Button
              onClick={() => navigate("/cart")}
              className="h-12 text-base font-medium w-full"
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              color="default"
              variant="solid"
            >
              GO TO CART
            </Button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Button
                onClick={handleAddToCart}
                className="h-12 text-base font-medium"
                type="default"
                icon={<ShoppingCartOutlined />}
                size="large"
                loading={isAddingToCart}
              >
                ADD TO CART
              </Button>
              <Button
                onClick={handleBuyNow}
                className="h-12 text-base font-medium"
                type="primary"
                icon={<ShoppingOutlined />}
                size="large"
                color="default"
                variant="solid"
              >
                BUY NOW
              </Button>
            </div>
          )}

          {/* Wishlist Button */}
          {/* <Button
            className="mt-4 h-12 text-base w-full border-dashed"
            icon={<HeartOutlined />}
          >
            ADD TO WISHLIST
          </Button> */}

          {/* Delivery & Returns Info */}
          <div className="mt-8 border rounded-md p-4 bg-gray-50">
            <Title level={5}>Delivery & Returns</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-start">
                <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                <div>
                  <Text strong>Free Delivery</Text>
                  <Text type="secondary" className="block">
                    On orders above ₹499
                  </Text>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                <div>
                  <Text strong>Easy Returns</Text>
                  <Text type="secondary" className="block">
                    30 days return policy
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultActiveKey="1" className="border-t pt-4">
          <TabPane
            tab={<span className="px-2 text-base">Product Details</span>}
            key="1"
          >
            <div className="py-4">
              <Title level={4}>Description</Title>
              <Paragraph className="text-base">
                {product.description ||
                  "Experience the perfect blend of style and comfort with our premium quality product. Made from the finest materials and crafted with attention to detail, this item is designed to last."}
              </Paragraph>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Title level={5}>Materials</Title>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Premium cotton blend</li>
                    <li>Breathable fabric</li>
                    <li>Eco-friendly dyes</li>
                  </ul>
                </div>
                <div>
                  <Title level={5}>Features</Title>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Comfortable fit</li>
                    <li>Durable construction</li>
                    <li>Easy to maintain</li>
                  </ul>
                </div>
                <div>
                  <Title level={5}>Care Instructions</Title>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Machine wash cold</li>
                    <li>Tumble dry low</li>
                    <li>Do not bleach</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={<span className="px-2 text-base">Shipping & Returns</span>}
            key="3"
          >
            <div className="py-4">
              <Title level={4}>Shipping Information</Title>
              <Paragraph className="mb-4">
                We offer free shipping on all orders above ₹499. Standard
                delivery typically takes 3-5 business days. For express delivery
                options, please select the appropriate option at checkout.
              </Paragraph>

              <Title level={4} className="mt-6">
                Return Policy
              </Title>
              <Paragraph>
                We accept returns within 30 days of delivery. The item must be
                unused and in the same condition that you received it. It must
                also be in the original packaging. To start a return, please
                contact our customer service team.
              </Paragraph>
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* Similar Products Section - Optional */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="mb-0">
            You May Also Like
          </Title>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similarProducts?.map((item) =>
            item.id !== product.id ? (
              <div
                onClick={() => similarProductClick(item.id)}
                key={item.id}
                className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <Carousel
                    autoplay={false}
                    className="product-carousel h-[280px]"
                    dots={{ className: "custom-dots" }}
                  >
                    {item.images?.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ))}
                  </Carousel>
                </div>
                <div className="p-3">
                  <Text strong className="line-clamp-1">
                    {item.name}
                  </Text>
                  <div className="flex items-center justify-between mt-1">
                    <Text className="font-semibold">{item.price}</Text>
                    <Text type="secondary" className="line-through text-sm">
                      {item.originalPrice}
                    </Text>
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
};
