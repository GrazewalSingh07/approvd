import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { useLocation } from 'react-router-dom';
import { Alert, Button, Carousel, Divider, Flex, Space,message } from "antd";
import { QuantityCounter } from "../customComponents/QuantityCounter";

export const ProductDetail = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get("id"); 
    const category=queryParams.get("category");
    const currentUser = auth.currentUser;
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchProductDetails = async () => {
        if (productId) {
            try {
                const productDoc = doc(db, category, productId); // Specify your Firestore collection
                const productSnapshot = await getDoc(productDoc);

                if (productSnapshot.exists()) {
                    setProduct(productSnapshot.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching product details: ", error);
            }
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]); // Fetch product details when the ID changes

    const handleAddToCart = async () => {
        try {
            if (!currentUser) {
                alert("Please log in to add items to the cart");
                return;
            }
            
            // Reference to the user's cart document
            const cartRef = doc(db, 'carts', currentUser.uid);
            const cartDoc = await getDoc(cartRef);

            const cartItem = {
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                totalPrice: product.price * quantity,
                image: product.images[0],
            };

            if (cartDoc.exists()) {
                // Update existing cart (push new item into array or increase quantity)
                await updateDoc(cartRef, {
                    items: arrayUnion(cartItem)
                });
            } else {
                // Create a new cart document if it doesn't exist
                await setDoc(cartRef, {
                    items: [cartItem]
                });
            } 
            
            messageApi.open({
                type: 'success',
                content: 'Product added to cart',
                className: 'text-white',
                
              });
            
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'Something went Wrong!',
                className: 'text-white',
                
              });
             
        }
    };

    return (
        <div className="h-screen max-w-[1660px] overflow-y-scroll  md:p-8 m-auto">
             {contextHolder}
            {product ? (

                 <div className="flex max-md:flex-col justify-center m-auto">
                   
                    <Carousel className=" h-full m-auto max-md:w-[360px] w-[460px]">
                        {product?.images.map(image =><div className="w-[460px] max-md:w-[360px]"> <img src={product.images[0]} alt={product.name} /></div>)}
                        </Carousel>
                   <div className="px-8 ">
                    <h1 className="text-black font-semibold max-md:text-[24px] text-[42px] md:pb-8">{product.name}</h1>
                        
                        <p className="text-black text-left text-xl" ><span className="text-orange-500"> ₹{product.price} INR</span> <span className="line-through">₹{product.originalPrice} M.R.P</span></p>
                      <p className="text-black">{'(incl. of all taxes)'}</p>
                      <Divider  style={{
                        borderColor: 'black',
                    }}/>
                    <div>
                        <p className="text-black md:pb-4">Size:</p>
                        <Flex gap="middle">
                        {product.size.map((el)=> <Space>
                                <Button className="capitalize bg-transparent text-black" variant="outlined" >{el.toUpperCase()}</Button>
                                </Space>)}
                        </Flex>

                    </div>
                   <div className="py-8">
                   <p className="text-black md:pb-4">Quantity:</p>
                   <QuantityCounter quantity={quantity} setQuantity={setQuantity}/>
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
 