"use client"

import LetterPullup from "./magicui/letter-pullup";
import {motion} from 'framer-motion'
import {useState, useEffect} from 'react'

export default function AnswerButton({
    item,
    index
}: {
    item: any,
    index: any
}) {
    return <>
        

        <motion.div
            className="border shadow-[rgba(50,50,93,0.15)_0px_4px_8px_-1px,_rgba(0,0,0,0.2)_0px_2px_4px_-1px] rounded-xl cursor-pointer grid place-items-center bg-white hover:bg-gray-100 "
            initial={{ opacity: 0, scale: 0.8, backgroundColor: "#FFFFFF", y: -(10 + 0.3 * index) }}
            animate={{ opacity: 1, scale: 1, y: 1 }} // Adjust y position
            whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
                backgroundColor: index == 1 ? "!#00FF00" : ""
            }}
        >
            <LetterPullup words={`${item}`} delay={0.05} />
        </motion.div>
    </>
}