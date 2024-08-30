import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FlashCard = ({
  front,
  back
}: {
  front: string,
  back: string
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-container w-full" onClick={handleFlip}>
      <motion.div
        className={`flashcard w-[300px] lg:w-[400px] text-2xl mx-auto ${isFlipped ? 'flipped' : ''}`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flashcard-front">{front}</div>
        <div className="flashcard-back">{back}</div>
      </motion.div>
    </div>
  );
};

export default FlashCard;
