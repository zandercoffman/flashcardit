"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 100 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false); // Track animation state
    const childrenArray = React.Children.toArray(children);

    useEffect(() => {
      if (!hasAnimated) {
        const interval = setInterval(() => {
          setIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % childrenArray.length;
            if (nextIndex === 0) {
              clearInterval(interval);
              setHasAnimated(true); // Mark animation as complete
            }
            return nextIndex;
          });
        }, delay);
      }
    }, [childrenArray.length, delay, hasAnimated]);

    const itemsToShow = useMemo(
      () => (hasAnimated ? childrenArray : childrenArray.slice(0, index + 1)).reverse(),
      [index, childrenArray, hasAnimated],
    );

    return (
      <div className={`flex flex-col items-center ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}
