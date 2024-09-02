"use client";

import { useEffect, useState } from "react";
import LetterPullup from "./magicui/letter-pullup";
import { motion } from 'framer-motion';

export default function AnswerButton({
    item,
    index,
    isCorrect,
    onClick,
    current
}: {
    item: any,
    index: any,
    isCorrect?: boolean,
    onClick?: (arg0: string) => boolean,
    current: number
}) {
    // Determine background color based on answer status
    const [bgColor, setBgColor] = useState("#FFFFFF");
    const [boxShadow, setBoxShadow] = useState("none");

    const doStuff = () => {
        let isAnswerCorrect = false;
        if (onClick) {
            isAnswerCorrect = onClick(item);
        }
        setBgColor(isAnswerCorrect ? "#00FF00" : "#FF0000"); // Set the color directly
        setBoxShadow(isAnswerCorrect 
            ? "0 0 10px 2px rgba(0, 255, 0, 0.7)"  // Green glow for correct
            : "0 0 10px 2px rgba(255, 0, 0, 0.7)"); // Red glow for incorrect
    };

    useEffect(() => {
        setBgColor("#FFFFFF"); // Reset background color
        setBoxShadow("var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)"); // Reset shadow
    }, [current]);

    return (
        <motion.div
            className="border-2 p-4 lg:p-2 shadow-[rgba(50,50,93,0.15)_0px_4px_8px_-1px,_rgba(0,0,0,0.2)_0px_2px_4px_-1px] rounded-xl cursor-pointer grid place-items-center"
            initial={{ opacity: 0, scale: 0.8, y: -(10 + 0.3 * index) }}
            animate={{ opacity: 1, scale: 1, y: 1 }} // Adjust y position
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ borderColor: bgColor, boxShadow: boxShadow }}
            onClick={() => {
                doStuff();
            }}
        >
            {
                `${item}`.length > 33 ? <span className="text-sm">{`${item}`.substring(0, 148)}</span> : <LetterPullup words={`${item}`} delay={0.05} />
            }
        </motion.div>
    );
}
