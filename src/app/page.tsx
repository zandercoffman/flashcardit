"use client"

import LeftSide from "@/components/sides/LeftSide";
import RightSide from "@/components/sides/RightSide";
import { useEffect, useState } from "react";

interface Set {
  title: string;
  vocab: [string, string][]; // Array of tuples with two strings
}

export default function Home() {
  type Mode = 'normal' | 'test' | 'lesson';
  const [pastSets, setPastSets] = useState<Set[]>([]);

  const [selected, setSelected] = useState<boolean[]>(new Array(pastSets.length).fill(false));
  const setAtIndex = (i: number) => {
    var x = selected;
    x = new Array(x.length).fill(false);
    x[i] = true;
    setSelected(x);
  }
  useEffect(() => {
    setSelected(
      Array.from({ length: pastSets.length }, (_, index) => index === 0)
    );
  }, [pastSets])

  const [curMode, setMode] = useState<Mode>('normal');

  return (
    <main className="flex min-h-screen min-w-screen overflow-hidden flex-col-reverse lg:flex-row gap-3 items-center justify-between">
      <div className="w-full lg:w-[20%] h-[20%] lg:h-full ">
        <LeftSide pastSets={pastSets} setPastSets={setPastSets} selected={selected} setAtIndex={setAtIndex} />
      </div>
      <div className="w-full lg:w-[80%] h-[80%] lg:h-full p-12 lg:p-0 ">
        <RightSide pastSets={pastSets} selected={selected}/>
      </div>
    </main>
  );
}
