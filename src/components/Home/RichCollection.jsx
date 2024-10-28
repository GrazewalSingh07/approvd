import React from 'react';
import { Carousel } from 'antd';
const contentStyle = {
  margin: 0,
  maxHeight: '660px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
//   background: '#364d79',
};
export const RichCollection = () => {
  return (
    <div>
        <h2 className='md:my-8 my-4 text-black font-bold text-center md:text-4xl text-2xl'>Rich Heritage. Boldly Reimagined</h2>
        <Carousel autoplay  dotPosition="bottom" infinite>
      <div>
        <div style={contentStyle}><img src="/richcol/image4.jpg"/></div>
      </div>
      <div>
      <div style={contentStyle}><img src="/richcol/image1.jpg"/></div>
      </div>
      <div>
      <div style={contentStyle}><img src="/richcol/image2.jpg"/></div>
      </div>
      <div>
      <div style={contentStyle}><img src="/richcol/image3.jpg"/></div>
      </div>
    </Carousel>
    </div>
  )
}

 