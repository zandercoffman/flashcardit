"use client"

import LeftSide from "@/components/sides/LeftSide";
import RightSide from "@/components/sides/RightSide";
import { useEffect, useState } from "react";

interface Set {
  title: string;
  vocab: [string, string][]; // Array of tuples with two strings
}

export default function Home() {
  type Mode = 'normal' | 'test' | 'quiz';
  const [pastSets, setPastSets] = useState<Set[]>([]);

  const [selected, setSelected] = useState<number | null>(null);
  const [curMode, setMode] = useState<Mode>('normal');

  const getRidOfSet = (index: number) => {
    setSelected(null);
    
    setTimeout(() => {
      setPastSets(prevSets => prevSets.filter((_, i) => i !== index));
    }, 100);
  }

  return (
    <main className="flex min-h-screen min-w-screen overflow-hidden flex-col lg:flex-row gap-3 items-center justify-between">
      
      <div className="w-full lg:w-[23%] h-fit lg:h-full ">
        
        <LeftSide
          pastSets={pastSets}
          setPastSets={setPastSets}
          selected={selected}
          setSelected={setSelected}
          getRidOfSet={getRidOfSet}
        />
      </div>
      <div className="w-full lg:w-[77%] h-[80%] lg:h-full p-12 lg:p-0 ">
        <RightSide
          pastSets={pastSets}
          selected={selected}
          getRidOfSet={getRidOfSet}
          setMode={setMode}
          curMode={curMode}
          setSelected={setSelected}
        />
      </div>
    </main>
  );
}
