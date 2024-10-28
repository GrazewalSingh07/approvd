import React from 'react';
import { Carousel } from 'antd';
const contentStyle = {
  margin: 0,
  maxHeight: '460px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
//   background: '#364d79',
};
export const Hero = () => {
  return (
    <div>
        <Carousel autoplay arrows dotPosition="left" infinite>
      <div>
        <div style={contentStyle}><img src="/hero_1.jpg"/></div>
      </div>
      <div>
      <div style={contentStyle}><img src="/hero_4.jpg"/></div>
      </div>
      <div>
      <div style={contentStyle}><img src="/hero_3.jpg"/></div>
      </div>
      <div>
      <div style={contentStyle}><img src="/hero_2.jpg"/></div>
      </div>
    </Carousel>
    </div>
  )
}

 