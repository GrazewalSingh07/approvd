import { Flex, Space } from 'antd';
import React from 'react'
import nextId from "react-id-generator";
import { useNavigate } from 'react-router-dom';
const data=[
    {id: nextId,
    title:"TSHIRTS",
image:"/categories/tshirts.webp",type:"topwear",category:"tshirt"},{id: nextId,
    title:"SHIRTS",
image:"/categories/tshirts.webp",type:"topwear",category:"shirt"}, {id: nextId,
    title:"Sweatshirts",
image:"/categories/sweatshirt.jpg",type:"topwear",category:"sweatshirt"}, {id: nextId,
    title:"POLO",
image:"/categories/polo.jpeg",type:"topwear",category:"polo"},{id: nextId,
    title:"Jackets",
image:"/categories/jaclet.jpeg",type:"topwear",category:"jacket"},{id: nextId,
    title:"Hoodies",
image:"/categories/hoodie.jpg",type:"topwear",category:"hoodie"},{id: nextId,
    title:"Gym Wear",
image:"/categories/gymwear.jpeg",type:"topwear",category:"gymwear"},{id: nextId,
    title:"Bottoms",
image:"/categories/bottoms.jpeg",type:"bottomwear",category:"trouser"}
]
export const Categories = () => {
    const navigate= useNavigate()
    const handleClick=(data)=>()=>{
      navigate(`/products?type=${data.type}&category=${data.category}`)
    }
    
  return (
    <Flex justify='space-evenly' gap={10} className='max-w-[1600px] my-8 mx-auto overflow-scroll cursor-pointer '>
      {data?.map((el)=>{
            return <div onClick={handleClick(el)} >
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
