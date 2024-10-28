import { Carousel, Flex, Space } from 'antd';
import React from 'react'
import nextId from "react-id-generator";
import useWindowSize from '../../hooks/useBreakpoints';
const data=[
    {id: nextId,
    title:"Trusted by 1000+ people",
image:"/whyus/trust.jpeg"}, {id: nextId,
    title:"Made with premium materials",
image:"/whyus/material.jpeg"}, {id: nextId,
    title:"Secure Checkout",
image:"/whyus/secure.jpeg"}
]
 
export const Whyus= () => {
    const size=useWindowSize()
  
  return size == 'sm'||size=='xs' ?  <Carousel dots dotPosition='bottom' autoplay infinite>
         {data?.map((el)=>{
            return <div>
                 <div className='h-[220px]'  key={el.id}> 
                <img className='mx-auto ' src={el.image} alt={el.title} />
                <p className='text-black text-center my-2 capitalize'>{el.title}</p>
            </div>
            </div>
        })}
    </Carousel>: <Flex className='mx-auto my-8  max-w-[1660px]' justify='space-around'>
        {data?.map((el)=>{
            return  <div className='h-[220px]'  key={el.id}> 
                <img className='mx-auto ' src={el.image} alt={el.title} />
                <p className='text-black text-center my-2 capitalize'>{el.title}</p>
            </div>
             
        })}
    </Flex> 
  
}
