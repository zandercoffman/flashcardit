"use client"

import FlashCard from "../FlashCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BookCheck, BookOpen, BookX, EyeIcon, EyeOffIcon, Milestone, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion'
import LetterPullup from "@/components/magicui/letter-pullup";
import AnswerButton from "../AnswerButton";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import type { ConfettiRef } from "@/components/magicui/confetti";
import Confetti from "@/components/magicui/confetti";

interface Set {
    title: string;
    id: string;
    vocab: [string, string][]; // Array of tuples with two strings
}

export default function RightSide({
    pastSets = [],
    selected = null,
    getRidOfSet,
    setMode,
    curMode
}: {
    pastSets: Set[],
    selected: number | null,
    getRidOfSet: Function,
    setMode: Function,
    curMode: 'normal' | 'test' | 'quiz'
}) {

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(1)
    const [count, setCount] = React.useState(1)

    const [answer1, setAnswer1] = useState<string | null>("he");
    const [answer2, setAnswer2] = useState<string | null>("b");
    const [answer3, setAnswer3] = useState<string | null>("a");
    const [answer4, setAnswer4] = useState<string | null>("hea");

    const [userAnswer, setUserAnswer] = useState('')
    const [points, setPoints] = useState(100)
    const [revealedHints, setRevealedHints] = useState<boolean[]>([])

    const questions = [
        { word: 'suburbs', hints: ['Residential area outside a city', 'Often characterized by single-family homes', 'Usually less densely populated than urban areas'] },
        { word: 'urban', hints: ['Related to cities', 'Densely populated area', 'Opposite of rural'] },
        { word: 'metropolitan', hints: ['Large city and its surrounding areas', 'Major urban center', 'Often includes multiple municipalities'] },
    ]

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAttempted, setIsAttempted] = useState<boolean>(false);

    const confettiRef = useRef<ConfettiRef>(null);

    const handleAnswerClick = (answer: string) => {
        if (selected !== null) {
            setSelectedAnswer(answer);
            setIsAttempted(true);
            // Check if the answer is correct
            const isCorrect = answer == pastSets[selected].vocab[current - 1][1];
            if (isCorrect) {
                confettiRef.current?.fire({});
                confettiRef.current?.fire({});
                return true;
            }
        }
        return false;

    };

    useEffect(() => {
        if (selected !== null && current !== null && pastSets.length !== 0) {
            const set = pastSets[selected];
            const vocab = set.vocab;
            const correctAnswer = vocab[current - 1][1]; // Extract the correct answer
            const incorrectAnswers = vocab
                .filter((entry, index) => index !== current - 1) // Filter out the correct answer
                .map(entry => entry[1]); // Extract only the answers

            // Shuffle the incorrect answers and pick a few
            const shuffledIncorrectAnswers = incorrectAnswers.sort(() => 0.5 - Math.random());
            const numIncorrectAnswers = 3; // Number of incorrect answers to select
            const selectedIncorrectAnswers = shuffledIncorrectAnswers.slice(0, numIncorrectAnswers);

            // Combine the correct answer with the incorrect answers
            const allAnswers = [correctAnswer, ...selectedIncorrectAnswers];

            // Shuffle the answers
            const shuffledAnswers = allAnswers.sort(() => 0.5 - Math.random());

            // Assign shuffled answers to state variables
            setAnswer1(shuffledAnswers[0]);
            setAnswer2(shuffledAnswers[1]);
            setAnswer3(shuffledAnswers[2]);
            setAnswer4(shuffledAnswers[3]);
        }
    }, [current, pastSets, selected])

    const revealHint = (index: number) => {
        if (points >= 10) {
            setPoints(prevPoints => prevPoints - 10)
            setRevealedHints(prev => {
                const newRevealed = [...prev]
                newRevealed[index] = true
                return newRevealed
            })
        }
    }

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

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

    if (selected == null)
        return <>
            <div className="size-full grid place-items-start mx-40">
                <div className="flex items-center justify-start mb-4">
                    <div className="bg-muted p-2 rounded-md">
                        <X className="h-6 w-6 text-muted-foreground" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">No Selected Card Set</h2>
                <p className="text-muted-foreground">
                    You haven{"'"}t selected any flash card sets yet. Start by selecting your set to begin!
                </p>
            </div>
        </>

    return (
        <>
            <div className="mx-auto flex flex-col w-[80vw] lg:max-w-2xl relative p-4">

                <Carousel
                    className="relative overflow-hidden"
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent className="flex">
                        {
                            pastSets[selected].vocab.map((vocab: [string, string]) => {
                                return <>
                                    <CarouselItem className="flex-shrink-0 w-full md:w-96 p-2">
                                        <FlashCard front={vocab[0]} back={vocab[1]} />
                                    </CarouselItem>
                                </>
                            })
                        }

                    </CarouselContent>
                    {
                        curMode == 'quiz' &&
                        <>
                            <Confetti
                                ref={confettiRef}
                                className="absolute left-0 top-0 z-0 size-full"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.68, -0.55, 0.27, 1.55],
                                }}
                                className="h-full lg:h-[200px] mx-auto w-full lg:w-[600px] p-2 border rounded-xl grid grid-cols-1 grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 gap-2"
                            >
                                {[answer1, answer2, answer3, answer4].filter(ans => ans != null).map((item, index) => (
                                    <AnswerButton
                                        item={item}
                                        index={index}
                                        key={index}
                                        isCorrect={item === pastSets[selected].vocab[current - 1][1] && selectedAnswer === item}
                                        onClick={() => handleAnswerClick(item)}
                                        current={current}
                                    />
                                ))}
                            </motion.div>
                        </>

                    }
                    {
                        curMode == 'test' && <>
                            <Card className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="w-full sm:w-1/2">
                                        <h3 className="text-lg font-semibold mb-2">Hints:</h3>
                                        <ul className="list-none space-y-2">
                                            {questions[0].hints.map((hint, index) => (
                                                <li key={index} className="flex items-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => revealHint(index)}
                                                        disabled={revealedHints[index]}
                                                        className="mr-2 flex-shrink-0"
                                                    >
                                                        {revealedHints[index] ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                                    </Button>
                                                    <span className={`text-sm ${revealedHints[index] ? 'text-gray-600' : 'text-gray-400'}`}>
                                                        {revealedHints[index] ? hint : 'Hint hidden (10 points to reveal)'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="w-full sm:w-1/2 flex flex-col space-y-4">
                                        <Input
                                            type="text"
                                            placeholder="Enter your answer"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            className="w-full"
                                        />
                                        <Button onClick={() => null} className="w-full">Submit</Button>
                                    </div>
                                </div>
                            </Card>
                        </>
                    }
                    <CarouselPrevious
                        className={"absolute left-0 top-32 lg:top-1/2 transform -translate-y-1/2"}
                    />
                    <CarouselNext
                        className={"absolute right-0 top-32 lg:top-1/2 transform -translate-y-1/2"}
                    />

                </Carousel>




            </div>
            <ToggleGroup
                type="single"
                className="absolute top-11 lg:top-0 right-0 border h-12 w-30 mt-3 mr-6 rounded-xl px-1"
                onValueChange={(value) => setMode(value)}
                value={curMode}
            >
                <ToggleGroupItem value="normal" className="flex flex-row gap-2">
                    <BookOpen className="size-4 lg:size-6" /> Study
                </ToggleGroupItem>
                <ToggleGroupItem value="quiz" className="flex flex-row gap-2">
                    <BookCheck className="size-4 lg:size-6" /> Quiz
                </ToggleGroupItem>
                <ToggleGroupItem value="test" className="flex flex-row gap-2">
                    <Milestone className="size-4 lg:size-6" /> Test
                </ToggleGroupItem>
            </ToggleGroup>
            {
                /**
                 * 
                 * TODO: implement this later
                 * <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 absolute top-14 lg:top-3 right-4 border rounded-xl px-2 py-3">
                            <Switch id="airplane-mode" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Flip Default Card Face</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
                 */
            }


        </>
    );
}
