import { doc, getDoc } from "firebase/firestore";
import React, { useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { useLocation } from 'react-router-dom';
import { Button, Carousel, Divider, Flex, Space } from "antd";
import { QuantityCounter } from "../customComponents/QuantityCounter";
import { addToCart } from "../services/cartService";
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ProductDetail = () => {
  const location = useLocation();
  const currentUser = auth.currentUser;
  const [quantity, setQuantity] = useState(1);

  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("id");

  const fetchProductDetails = async () => {
    if (productId) {
      try {
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
          return productSnapshot.data();
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      }
    }
  };

  const { data: product } = useQuery({ queryKey: ['product', productId], queryFn: fetchProductDetails })

  const { mutate } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success('Product added to cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: () => {
      toast.error('Something went wrong.');
    }
  })

  const handleAddToCart = async () => {
    toast.dismiss();
    if (!currentUser) {
      toast.error('Please log in to add items to the cart');
      return;
    }
    const cartItem = {
      id: productId,
      name: product.name,
      price: product.price,
      quantity: quantity,
      totalPrice: product.price * quantity,
      image: product.images[0],
    };
    mutate(cartItem);
  };

  return (
    <div className="h-screen max-w-[1660px] overflow-y-scroll  md:p-8 m-auto">
      {product ? (

        <div className="flex max-md:flex-col justify-center m-auto">

          <Carousel className=" h-full m-auto max-md:w-[360px] w-[460px]">
            {product?.images?.map(image => <div className="w-[460px] max-md:w-[360px]" key={image}> <img src={product.images[0]} alt={product.name} /></div>)}
          </Carousel>
          <div className="px-8 ">
            <h1 className="text-black font-semibold max-md:text-[24px] text-[42px] md:pb-8">{product.name}</h1>

            <p className="text-black text-left text-xl" ><span className="text-orange-500"> ₹{product.price} INR</span> <span className="line-through">₹{product.originalPrice} M.R.P</span></p>
            <p className="text-black">{'(incl. of all taxes)'}</p>
            <Divider style={{
              borderColor: 'black',
            }} />
            <div>
              <p className="text-black md:pb-4">Size:</p>
              <Flex gap="middle">
                {product?.size?.map((el) => <Space key={el} >
                  <Button className="capitalize bg-transparent text-black" variant="outlined" >{el.toUpperCase()}</Button>
                </Space>)}
              </Flex>

            </div>
            <div className="py-8">
              <p className="text-black md:pb-4">Quantity:</p>
              <QuantityCounter quantity={quantity} setQuantity={setQuantity} />
            </div>
            <div>
              <Button onClick={handleAddToCart} className="w-full py-8">
                ADD TO CART
              </Button>

            </div>
            <div className="py-4">
              <Button className="w-full py-8">
                PROCEED TO BUY
              </Button>
            </div>
          </div>

        </div>
      ) : (
        <p className="text-black text-center">Loading...</p>
      )}
    </div>
  );
};

