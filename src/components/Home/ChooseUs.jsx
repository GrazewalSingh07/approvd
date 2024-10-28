import { Carousel, Flex, Space } from 'antd';
import React from 'react'
import nextId from "react-id-generator";
import useWindowSize from '../../hooks/useBreakpoints';
const data=[
    {id: nextId,
    title:"Free & Fast Delivery",desc:'Shipping within 48 hours across India.',
image:"/chooseus/delivery.jpeg"}, {id: nextId,
    title:"Refund policies",desc:"Returns and Refunds within 7 days.",
image:"/chooseus/return.jpeg"}, {id: nextId,
    title:"Contact us",desc:"Write us at support@approvdapparel.com",
image:"/chooseus/contact.jpeg"}
]
 
export const ChooseUs= () => {
    const size=useWindowSize()
     
  return size == 'sm'||size=='xs' ?  <Carousel dots dotPosition='bottom' autoplay infinite>
         {data?.map((el)=>{
            return <div>
                 <div className='h-[220px]'  key={el.id}> 
                <img className='mx-auto ' src={el.image} alt={el.title} />
                <p className='text-black text-center  font-semibold my-2 capitalize'>{el.title}</p>
                <p className='text-black text-center  my-2 capitalize'>{el.desc}</p>
            </div>
            </div>
        })}
    </Carousel>: <Flex className='mx-auto my-8  max-w-[1660px]' justify='space-around'>
        {data?.map((el)=>{
            return  <div className='h-[220px]'  key={el.id}> 
                <img className='mx-auto ' src={el.image} alt={el.title} />
                <p className='text-black text-center  font-semibold  my-2 capitalize'>{el.title}</p>
                <p className='text-black text-center  my-2 capitalize'>{el.desc}</p>
            </div>
             
        })}
    </Flex> 
  
}
