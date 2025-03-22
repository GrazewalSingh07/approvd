import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { Carousel, Col, Row } from "antd";
import { useQuery } from "@tanstack/react-query";

export const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

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
    loading,
    error,
  } = useQuery({
    queryKey: ["products", location.search],
    queryFn: fetchProducts,
  });

  const handleClick = (data) => () => {
    navigate(`/products/detail?id=${data.id}`);
  };

  return (
    <div>
      <div className="h-screen overflow-y-scroll">
        <h2 className="text-black font-semibold text-center capitalize text-[36px] md:text-[56px]">
          {queryParams.get("category")}
        </h2>
        {loading ? (
          <div>
            <p className="text-black">Loading...</p>
          </div>
        ) : error ? (
          <div>
            <p className="text-red-500">{error}</p>
          </div> // Display error message
        ) : products?.length === 0 ? (
          <div>
            <p className="text-black">No products found.</p>
          </div> // Display empty state message
        ) : (
          <Row className="justify-center" gutter={[16, 16]}>
            {products?.map((el, index) => (
              <Col
                key={el.id}
                onClick={handleClick(el)}
                className="cursor-pointer"
              >
                <div
                  className="h-[400px] w-[320px] shadow-md hover:shadow-2xl p-4"
                  key={index}
                >
                  <Carousel>
                    {el.images?.map((image) => (
                      <div className="h-[280px] w-full" key={image}>
                        <img src={image} alt="product" />
                      </div>
                    ))}
                  </Carousel>
                  <p className="px-4 text-base text-black pt-2">
                    <span className="font-semibold">{el.name}</span>
                  </p>
                  <p className="px-4 text-sm text-orange-500 pt-2">
                    ₹<span className="font-semibold">{el.price} INR</span>
                    <span className="font-semibold text-gray-500 line-through">
                      {el.originalPrice} M.R.P
                    </span>
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
