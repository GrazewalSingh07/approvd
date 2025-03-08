import { Flex, Space } from 'antd';
import React from 'react'
const data = [
  {
    id: 'sc1',
    title: "Nitro",
    image: "/categories/tshirts.webp"
  }, {
    id: 'sc2',
    title: "Palermo",
    image: "/categories/sweatshirt.jpg"
  }, {
    id: 'sc3',
    title: "Rider",
    image: "/categories/polo.jpeg"
  }, {
    id: 'sc4',
    title: "Ferrari",
    image: "/categories/jaclet.jpeg"
  }, {
    id: 'sc5',
    title: "Jerseys",
    image: "/categories/hododie.jpg"
  }, {
    id: 'sc6',
    title: "Basketball",
    image: "/categories/gymwear.jpeg"
  }
]
export const ShoeCategory = () => {

  return (
    <Flex justify='space-evenly' gap={10} className='max-w-[1100px] my-8 mx-auto overflow-scroll cursor-pointer  '>
      {data?.map((el) => {
        return <div key={el.id}>
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
