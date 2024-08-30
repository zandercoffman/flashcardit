"use client"

import FlashCard from "../FlashCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BookCheck, BookOpen, BookX, Milestone } from "lucide-react";
import { useEffect, useState } from "react";

interface Set {
    title: string;
    vocab: [string, string][]; // Array of tuples with two strings
}

export default function RightSide({
    pastSets = [],
    selected = []
}: {
    pastSets: Set[],
    selected: boolean[]
}) {

    const [selectedNum, setSelectedNum] = useState<number>(
        selected.findIndex(value => value === true)
    );

    useEffect(() => {
        setSelectedNum(
            selected.findIndex(value => value === true)
        )
    }, [selected])

    if (pastSets.length == 0) {
        return <>
            <div className="size-full grid place-items-center">
                <div>
                    <BookX className="w-12 h-12 mb-4 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold mb-2">No Flash Card Sets</h2>
                    <p className="text-muted-foreground">
                        You haven{"'"}t created any flash card sets yet. Start by creating your first set to begin studying!
                    </p>
                </div>
            </div>
        </>
    }


    return (
        <>
            <div className="mx-auto max-w-2xl relative p-4">
                <Carousel className="relative overflow-hidden">
                    <CarouselContent className="flex">
                        {
                            pastSets[selectedNum].vocab.map((vocab: [string, string]) => {
                                return <>
                                    <CarouselItem className="flex-shrink-0 w-full md:w-96 p-2">
                                        <FlashCard front={vocab[0]} back={vocab[1]} />
                                    </CarouselItem>
                                </>
                            })
                        }
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
                    <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
                </Carousel>

            </div>
            <ToggleGroup type="single" className="absolute top-0 right-0 border h-12 w-30 mt-3 mr-6 rounded-xl px-1">
                <ToggleGroupItem value="b" className="flex flex-row gap-2"><BookOpen /> Normal</ToggleGroupItem>
                <ToggleGroupItem value="a" className="flex flex-row gap-2"><BookCheck /> Quiz</ToggleGroupItem>
                <ToggleGroupItem value="c" className="flex flex-row gap-2"><Milestone /> Lesson</ToggleGroupItem>
            </ToggleGroup>
        </>
    );
}
