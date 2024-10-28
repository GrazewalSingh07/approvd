import { Flex, Space } from 'antd';
import React from 'react'
import nextId from "react-id-generator";
const data=[
    {id: nextId,
    title:"Nitro",
image:"/categories/tshirts.webp"}, {id: nextId,
    title:"Palermo",
image:"/categories/sweatshirt.jpg"}, {id: nextId,
    title:"Rider",
image:"/categories/polo.jpeg"},{id: nextId,
    title:"Ferrari",
image:"/categories/jaclet.jpeg"},{id: nextId,
    title:"Jerseys",
image:"/categories/hododie.jpg"},{id: nextId,
    title:"Basketball",
image:"/categories/gymwear.jpeg"}
]
export const ShoeCategory = () => {
    
  return (
    <Flex justify='space-evenly' gap={10} className='max-w-[1100px] my-8 mx-auto overflow-scroll cursor-pointer  '>
      {data?.map((el)=>{
            return <div>
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
