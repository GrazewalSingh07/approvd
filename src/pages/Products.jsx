import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { Carousel, Col, Dropdown, Flex, Row, Slider, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

export const Products = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate= useNavigate();
    const [products, setProducts] = useState([]);

    // Fetch products based on the category from Firestore
    const fetchProducts = async () => {
        const type = queryParams.get("type");  
        const category = queryParams.get("category");   
        if (category && type) {
            try {
                
                const productCollection = collection(db, type);  
                const q = query(productCollection, where("type", "==", category));   
                
                // Fetch filtered products
                const productSnapshot = await getDocs(q);
                // const productList = productSnapshot.docs.map(doc => doc.data());
                const productList = productSnapshot.docs.map(doc => ({
                    id: doc.id, // Get the document ID
                    ...doc.data() // Spread the document data
                }));
                setProducts(productList);  // Set the state with filtered products
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        }
    };
 
    useEffect(() => {
        fetchProducts();
    }, [location.search]);   
 const handleClick=(data)=>()=>{
    navigate(`/products/detail?category=${queryParams.get("type")}&id=${data.id}`);
 } 
 
    return (
       <div >
           {/* <div className="w-[400px]">
                <Dropdown
                   
                    dropdownRender={() => (
                        <div className=" p-4">
                            <Slider
                                range
                                
                                // onChange={(value) => setPriceRange(value)} // Update price range
                                max={10000}
                                min={799}
                                defaultValue={[799, 10000]}
                            />
                        </div>
                    )}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <p className="text-black">Price</p>
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div> */}
         <div className="h-screen overflow-y-scroll " >
            <h2 className="text-black font-semibold text-center capitalize text-[36px] md:text-[56px]">{queryParams.get("category")}</h2>
            {products.length === 0 ? (
                <div>  <p className="text-black">Loding...</p></div>
            ) : ( <Row className="justify-center"  gutter={[16, 16]}>
                 {products.map((el, index) => (
                   <Col key={el.id} onClick={handleClick(el)} className="cursor-pointer" >
            <div className=" h-[400px] w-[320px] shadow-md hover:shadow-2xl p-4 "  key={index}> 
                    
                    <Carousel >
                        {el.images?.map((image)=>{
                            return <div  className="h-[280px] w-full " >
                                    <img   src={image}/>
                                </div>
                                 
                        })}
                    </Carousel>
                     
                    <p className="px-4 text-base text-black pt-2"> <span className="font-semibold">
                    {el.name} </span></p>
                    <p className="px-4 text-sm text-orange-500  pt-2"> ₹ <span className="font-semibold">
                    {el.price} INR</span> <span className="font-semibold text-gray-500 line-through">
                    {el.originalPrice} M.R.P</span></p>
                   
                </div>
                   </Col>
                ))}
            </Row>
                
            )}
        </div>
       </div>
    );
};
