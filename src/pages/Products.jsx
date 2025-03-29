import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useLocation, useNavigate } from "react-router";
import {
  Carousel,
  Col,
  Row,
  Skeleton,
  Empty,
  Tag,
  Pagination,
  Button,
  Typography,
  Badge,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;

export const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const fetchProducts = async () => {
    const type = queryParams.get("type");
    const category = queryParams.get("category");
    if (category && type) {
      const productCollection = collection(db, "products");
      const q = query(
        productCollection,
        where("type", "==", type),
        where("category", "==", category),
      );
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return productList;
    }
  };

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", location.search],
    queryFn: fetchProducts,
  });

  const handleClick = (data) => () => {
    navigate(`/products/detail?id=${data.id}`);
  };

  // Calculate pagination
  const paginatedProducts = products?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const calculateDiscount = (originalPrice, price) => {
    if (!originalPrice || !price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="mb-8">
        <Title level={2} className="text-center capitalize mb-2">
          {queryParams.get("category") || "Products"}
        </Title>
        <Text className="block text-center text-gray-500 mb-6">
          Discover our collection of {queryParams.get("type")}{" "}
          {queryParams.get("category")}
        </Text>

        {/* Filters and sorting controls */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          {/* <div className="flex space-x-2 mb-2 md:mb-0">
            <Button icon={<FilterOutlined />}>Filters</Button>
            <Button icon={<SortAscendingOutlined />}>Sort By</Button>
          </div> */}
          <Text className="text-gray-500">{products?.length || 0} Items</Text>
        </div>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="mb-8">
              <Skeleton.Image className="w-full h-[280px]" active />
              <Skeleton active paragraph={{ rows: 1 }} className="mt-2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <Title level={4} className="text-red-500">
            Error loading products
          </Title>
          <Text>{error.message}</Text>
        </div>
      ) : products?.length === 0 ? (
        <Empty
          description="No products found. Try adjusting your filters."
          className="my-12"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts?.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer transition-all duration-300 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg"
                onClick={handleClick(product)}
              >
                <div className="relative">
                  {calculateDiscount(product.originalPrice, product.price) >
                    0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <Tag
                        color="red"
                        className="text-xs font-bold px-2 py-0.5"
                      >
                        {calculateDiscount(
                          product.originalPrice,
                          product.price,
                        )}
                        % OFF
                      </Tag>
                    </div>
                  )}

                  {/* <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      shape="circle"
                      icon={<HeartOutlined />}
                      className="bg-white shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add wishlist functionality
                      }}
                    />
                  </div> */}

                  <Carousel
                    autoplay={false}
                    className="product-carousel h-[280px]"
                    dots={{ className: "custom-dots" }}
                  >
                    {product.images?.map((image, idx) => (
                      <div
                        key={idx}
                        className="h-[280px] overflow-hidden bg-gray-50"
                      >
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>

                <div className="p-4">
                  <Text className="block font-medium text-gray-800 line-clamp-1 mb-1">
                    {product.name}
                  </Text>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <Text className="text-md font-bold">
                        ₹{product.price}
                      </Text>
                      {product.originalPrice && (
                        <Text className="ml-2 text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </Text>
                      )}
                    </div>

                    {/* <Button
                      type="primary"
                      shape="circle"
                      icon={<ShoppingCartOutlined />}
                      size="small"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                      }}
                    /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {products?.length > pageSize && (
            <div className="flex justify-center mt-12">
              <Pagination
                current={currentPage}
                onChange={setCurrentPage}
                total={products.length}
                pageSize={pageSize}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
