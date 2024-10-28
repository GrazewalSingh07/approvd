import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState('sm'); // Default size

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 375) {
        setSize('xs'); // Extra small
      } else if (width >= 375 && width < 768) {
        setSize('sm'); // Small
      } else if (width >= 768 && width < 992) {
        setSize('md'); // Medium
      } else if (width >= 992 && width < 1200) {
        setSize('lg'); // Large
      } else {
        setSize('xl'); // Extra large
      }
    };

    handleResize(); // Call once to set the initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

export default useWindowSize;