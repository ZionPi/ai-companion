import { motion } from 'framer-motion';
import React, { useState,useEffect } from 'react';

// 定义变体
const cardVariants = {
  front: {
    rotateY: 0
  },
  back: {
    rotateY: 180
  }
};

   const getRandomColor = () => {
        // Generate a random integer between 0 and 255 for each color component
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        // Return the RGB color string
        return `rgb(${red}, ${green}, ${blue})`;
    };

// 卡片组件
const QACard = ({question,answer}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // 点击事件处理函数
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    let timeoutId;

    if (isFlipped) {
      // Set a timer to flip back after 3 seconds
      timeoutId = setTimeout(() => {
        setIsFlipped(false);
      }, 3000); // Adjust the timeout as needed
    }

    // Cleanup function to clear the timer if the component unmounts or isFlipped changes
    return () => clearTimeout(timeoutId);
  }, [isFlipped]);

  return (
    <div onClick={handleClick}>
      <motion.div
        style={{
          width: 200,
          height: 300,
          borderRadius: 20,
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          transformStyle: 'preserve-3d',
          cursor: 'pointer'
        }}
        variants={cardVariants}
        animate={isFlipped ? 'back' : 'front'}
        transition={{ flip: { duration: 1, ease: "easeInOut" } }}
      >
        {/* 卡片的正面内容 */}
        <motion.div
          style={{
            position: 'absolute',
            backfaceVisibility: 'hidden',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            background:getRandomColor()
          }}
        >
          {question}
        </motion.div>
        {/* 卡片的背面内容 */}
        <motion.div
          style={{
            position: 'absolute',
            backfaceVisibility: 'hidden',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            rotateY: 180,
            background:getRandomColor()
          }}
        >
          {answer}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QACard;
