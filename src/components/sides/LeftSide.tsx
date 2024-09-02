"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ellipsis, Info, Milestone, MousePointerClick, PlusCircle, Terminal, Trash2, History, ClipboardCopy, X, Sparkles } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { useState, ChangeEvent, useEffect } from "react";
import { Badge } from "../ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatedList } from "../magicui/animated-list";
import { generateId } from 'ai'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import {motion} from 'framer-motion'

// Define the Set interface
interface Set {
    title: string;
    id: string;
    vocab: [string, string][]; // Array of tuples with two strings
}

export default function LeftSide({
    pastSets,
    setPastSets,
    selected,
    setSelected,
    getRidOfSet
}: {
    pastSets: Set[],
    setPastSets: Function,
    selected: number | null,
    setSelected: Function,
    getRidOfSet: Function
}) {

    const [open, setOpen] = useState(false);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const { toast } = useToast()

    const [history, setHistory] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const a = localStorage.getItem("enabledHistory");
            setHistory(a == "true")
        } catch (err) {

        } finally {

        }
    }, [])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && file.type === "text/csv") {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target?.result as string;
                const { title, vocab } = parseCSV(text);
                setPastSets((prevSets: Set[]) => [
                    ...prevSets,
                    { title: title, id: generateId(), vocab: vocab }
                ]);
                toast({
                    title: "Successfully imported file.",
                    description: "Have a good time studying.",
                    action: <ToastAction altText="Study Now">Study Now</ToastAction>,
                })
                setCsvData(vocab);
            };

            reader.onerror = () => {
                console.error("Failed to read file!");
                alert("Failed to read the file. Please try again.");
            };

            reader.readAsText(file);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const parseCSV = (csvText: string): { title: string; vocab: [string, string][] } => {
        const lines = csvText.split("\n").filter(line => line.trim() !== "");

        if (lines.length < 2) {
            throw new Error("CSV file is not formatted correctly. Ensure it contains a title and at least one vocab pair.");
        }

        const title = lines[0].trim();
        const vocab: [string, string][] = lines.slice(1).map(line => {
            const values = line.split(",").map(value => value.trim());
            // Check if we have exactly two values for each vocab pair
            if (values.length === 2) {
                return [values[0], values[1]] as [string, string];
            } else {
                console.warn(`Skipping invalid line: ${line}`);
                return null;
            }
        }).filter((pair): pair is [string, string] => pair !== null);

        return { title, vocab };
    };

    const truncateText = (text: string) => {
        if (text.length <= 25) return text;
        return text.slice(0, 25 - 3) + '...';
    };

    const [setName, setSetName] = useState('')
    const [words, setWords] = useState<[string, string][]>([['', '']])
    const [flashcardSets, setFlashcardSets] = useState<{ name: string, words: [string, string][] }[]>([])

    const addWordPair = () => {
        setWords([...words, ['', '']])
    }

    const updateWord = (index: number, column: 0 | 1, value: string) => {
        const newWords = [...words]
        newWords[index][column] = value
        setWords(newWords)
    }

    const removeWordPair = (index: number) => {
        const newWords = words.filter((_, i) => i !== index)
        setWords(newWords.length ? newWords : [['', '']])
    }

    const createSet = () => {
        if (setName && words.some(pair => pair[0] && pair[1])) {
            setFlashcardSets([...flashcardSets, { name: setName, words }])
            setSetName('')
            setWords([['', '']])
        }
    }

    const FlashcardSets = () => (
        <>
            <div className="flex flex-row justify-between items-center mb-5 gap-1">
                <div className="hidden lg:flex flex-row gap-2">
                    <h2 className="text-1xl font-bold">flashcard/it</h2>
                    <Badge className="h-fit">.vercel.app</Badge>
                </div>
                <Dialog>
                    <DialogTrigger className="flex flex-row gap-2">
                        <Info />
                        <span className="block lg:hidden font-bold">Information</span>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] h-[90vh] lg:h-[85vh] lg:min-w-[80vw] rounded-2xl flex flex-col">
                        <DialogHeader>
                            <DialogTitle>About flashcardit.vercel.app</DialogTitle>
                            <DialogDescription>
                                Welcome to the future of using flash cards. <span className="text-blue-500 font-semibold cursor-pointer"
                                    onClick={() => {
                                        navigator.share({
                                            url: "https://flashcardit.vercel.app/",
                                            title: "flashcardit"
                                        })
                                    }} >Share Site</span>
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="description" className="size-full mx-auto lg:mx-0">
                            <TabsList>
                                <TabsTrigger value="description">App Description</TabsTrigger>
                                <TabsTrigger value="ai-prompts">AI-Assisted Creation</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description">
                                <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                                <ul className="list-disc pl-5 space-y-2 mb-4">
                                    <li>
                                        <strong>Study Mode:</strong> Review your flash cards at your own pace, with options to mark cards as
                                        mastered or needing more review.
                                    </li>
                                    <li>
                                        <strong>Quiz Mode:</strong> Test your knowledge with interactive quizzes generated from your flash
                                        cards, providing immediate feedback and performance tracking.
                                    </li>
                                    <li>
                                        <strong>Test Mode:</strong> Simulate exam conditions with timed tests created from your flash card sets,
                                        helping you prepare for the real thing.
                                    </li>
                                </ul>
                                <p>
                                    With these three powerful modes, FlashMaster adapts to your learning style and helps you retain
                                    information more effectively.
                                </p>
                            </TabsContent>
                            <TabsContent value="ai-prompts">
                                <h3 className="text-lg font-semibold mb-2">AI-Assisted Card Creation:</h3>
                                <p className="mb-4">
                                    FlashMaster leverages AI to help you create flash cards quickly and easily. Use one of the following
                                    prompts to generate cards that can be easily imported into the app:
                                </p>
                                <div className="space-y-4 flex flex-row justify-between">
                                    <div>
                                        <h4 className="font-medium mb-2">Table Format Prompt:</h4>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                onClick={() => null}
                                                variant="outline"
                                            >
                                                <ClipboardCopy className="mr-2 h-4 w-4" />
                                                Copy Prompt
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Paragraph Format Prompt:</h4>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                onClick={() => null}
                                                variant="outline"
                                            >
                                                <ClipboardCopy className="mr-2 h-4 w-4" />
                                                Copy Prompt
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>
            <Input id="picture" type="file" onChange={handleFileChange} className="w-full mb-1 cursor-pointer" />
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="w-full mb-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Set
                    </Button>
                </SheetTrigger>
                <SheetContent side={'left'} className="h-screen">
                    <SheetHeader>
                        <SheetTitle>Create New Flashcard Set</SheetTitle>
                        <SheetDescription>Enter the details for your new flashcard set.</SheetDescription>
                    </SheetHeader>
                    <Accordion type="single" collapsible className="w-full max-w-md" defaultValue="ai-generate">
                        <AccordionItem value="ai-generate">
                            <AccordionTrigger>Generate with AI</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <Textarea placeholder="Enter text to generate flashcards" />
                                    <motion.div 
                                    className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white shadow-lg cursor-pointer"
                                    whileTap={{ scale: 0.95 }}>
                                        <Sparkles className="h-5 w-5" />
                                        <span>Generate with AI</span>
                                    </motion.div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="manual-create">
                            <AccordionTrigger>Create New Flashcard Set</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Set Name"
                                        value={setName}
                                        onChange={(e) => setSetName(e.target.value)}
                                    />
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Word 1</TableHead>
                                                <TableHead>Word 2</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {words.map((pair, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Input
                                                            value={pair[0]}
                                                            onChange={(e) => updateWord(index, 0, e.target.value)}
                                                            placeholder="Enter word"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={pair[1]}
                                                            onChange={(e) => updateWord(index, 1, e.target.value)}
                                                            placeholder="Enter definition"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" onClick={() => removeWordPair(index)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Button onClick={addWordPair} variant="outline" className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Word Pair
                                    </Button>
                                    <Button onClick={createSet} className="w-full">Create Set</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </SheetContent>
            </Sheet>
            <h3 className="text-lg font-semibold mb-1">All Sets</h3>
            {history == false && <>
                <Dialog>
                    <DialogTrigger asChild className="w-full mb-1">
                        <Button variant={"outline"} className="w-full flex flex-row gap-2">
                            <History />
                            <span>Enable History</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </>}
            <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-240px)]">
                {
                    history == null ? <>
                        <div className="space-y-2">
                            <Skeleton className="h-10 rounded-2xl w-[16.5vw]" />
                            <Skeleton className="h-10 rounded-2xl w-[16.5vw]" />
                            <Skeleton className="h-10 rounded-2xl w-[16.5vw]" />
                            <Skeleton className="h-10 rounded-2xl w-[16.5vw]" />
                            <Skeleton className="h-10 rounded-2xl w-[16.5vw]" />
                            <Skeleton className="h-10 rounded-2xl w-[16.5vw]" />
                            <Skeleton className="h-10 rounded-2xl w-[16.5vw]" />
                        </div>
                    </> : <>
                        {pastSets.map((set, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className={"w-full flex flex-row justify-between mb-2 relative " + (
                                    selected == index ? "bg-accent text-accent-foreground" : ""
                                )}
                                onClick={() => {
                                    setOpen(false)
                                    setSelected(index)
                                }}
                            >
                                <span>{truncateText(set.title)}</span>
                                <Popover>
                                    <PopoverTrigger><Ellipsis className="!text-accent-foreground" /></PopoverTrigger>
                                    <PopoverContent className="rounded-2xl flex flex-col gap-1 w-[150px]">
                                        <Button className="w-min mx-auto flex flex-row gap-1 !bg-white !text-black" onClick={() => {
                                            getRidOfSet(index)
                                            toast({
                                                title: "Successfully deleted."
                                            })
                                        }}><Trash2 /> Delete</Button>
                                    </PopoverContent>
                                </Popover>

                            </Button>
                        ))}
                    </>
                }

            </ScrollArea>
        </>
    );

    if (history == null)
        return <div className="w-full hidden lg:block p-6 border-r"><FlashcardSets /></div>

    return (
        <>
            {/* Desktop view */}
            <div className="w-full hidden h-screen lg:block p-6 border-r">
                <FlashcardSets />
            </div>

            {/* Mobile-ish view */}
            <div className="w-full flex flex-row justify-between lg:hidden p-6 border-r">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger>
                        <Image
                            src={"/menu.svg"}
                            alt={"Hamburger Icon"}
                            width={20}
                            height={20}
                        />
                    </SheetTrigger>
                    <SheetContent side={"left"} className="w-[98vw] rounded-r-2xl lg:hidden">
                        <FlashcardSets />
                    </SheetContent>
                </Sheet>
                <div className="flex flex-row gap-2">
                    <h2 className="text-1xl font-bold">flashcard/it</h2>
                    <Badge className="h-fit">.vercel.app</Badge>
                </div>
            </div>
        </>
    );
}
