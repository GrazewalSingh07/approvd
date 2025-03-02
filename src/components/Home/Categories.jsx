import { Flex, Space } from 'antd';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from "firebase/firestore";
import { useState } from 'react';

export const Categories = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()
  const handleClick = (data) => () => {
    navigate(`/products?type=${data.type}&category=${data.category}`)
  }

  const fetchProducts = async () => {
    const productsRef = collection(db, "categories");
    try {
      const querySnapshot = await getDocs(productsRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        const productData = { id: doc.id, ...doc.data() };
        data.push(productData);
      });
      setProducts(data);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <Flex justify='space-evenly' gap={10} className='max-w-[1600px] my-8 mx-auto overflow-scroll cursor-pointer '>
      {products?.map((el) => {
        return <div onClick={handleClick(el)} key={el.id}>
          <Space className='border-4 p-1.5  rounded-full border-yellow-600'  >
            <div className='w-28 h-28 max-md:w-20 max-md:h-20 overflow-hidden rounded-full '>
              <img src={el.image} alt="" />
            </div>
          </Space>
          <p className='text-black text-center capitalize'>{el.title}</p>
        </div>
      })}
    </Flex>
  )
}
