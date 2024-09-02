"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ellipsis, Info, Milestone, MousePointerClick, PlusCircle, Terminal, Trash2, History, ClipboardCopy, X, Sparkles, BookOpen, BrainCircuit, Clock, Copy, AlignLeft, ArrowDownToLine, Loader, Loader2 } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { useState, ChangeEvent, useEffect, SetStateAction } from "react";
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
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Roboto } from "next/font/google";
import { Slider } from "@/components/ui/slider"
import { saveAs } from 'file-saver';

// Define the Set interface
interface Set {
    title: string;
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
    const [downloading, setDownloading] = useState<boolean>(false);

    const addWordPair = () => {
        setWords([...words, ['', '']])
    }

    const download = async (set: Set) => {
        setDownloading(true);
        try {
            const response = await fetch('/api/generate-printable', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vocab: set.vocab })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            saveAs(blob, 'set.pdf');
            toast({
                title: "Your set has been generated!",
                description: "Enjoy studying!"
            })

        } catch (err: any) {
            toast({
                title: "There was an error trying to generate.",
                description: err.message
            })
        } finally {
            setDownloading(false);
        }

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
                                <ScrollArea className="h-[55vh] w-full">
                                    <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                                    <Description />

                                </ScrollArea>
                                <p>
                                    With these three powerful modes, flashcard/it adapts to your learning style and helps you retain
                                    information more effectively.
                                </p>
                            </TabsContent>
                            <TabsContent value="ai-prompts">
                                <AIPart />
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
                    <Accordion type="single" collapsible className="w-full max-w-md" defaultValue="upload-create">
                        <AccordionItem value="upload-create">
                            <AccordionTrigger>Paste Made File</AccordionTrigger>
                            <AccordionContent>

                            </AccordionContent>
                        </AccordionItem>
                        {
                            /**
                             * <AccordionItem value="ai-generate">
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
                             */
                        }
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
            {
                downloading ?
                    <>
                        <div className="w-full lg:w-[20vw] h-[60vh] grid place-items-center">
                            <div className="flex flex-col items-center gap-1">
                                <Loader2 className="size-16 text-gray-400 animate-spin" />
                                <span className="font-semibold text-gray-400">Generating...</span>
                            </div>
                        </div>
                    </> : <>
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
                                                <PopoverContent className="rounded-2xl flex flex-col gap-1 w-max">
                                                    <Button className="w-min flex flex-row gap-1 !bg-white !text-black" onClick={() => {
                                                        download(set);
                                                    }}><ArrowDownToLine /> Download</Button>
                                                    <Button className="w-min flex flex-row gap-1 !bg-white !text-black" onClick={() => {
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
            }

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

function Description() {
    const features = [
        {
            title: "Study Mode",
            description: "Review flash cards at your own pace",
            icon: <BookOpen className="h-6 w-6" />,
            details: "Mark cards as mastered or needing more review. Perfect for self-paced learning!"
        },
        {
            title: "Quiz Mode",
            description: "Test your knowledge with interactive quizzes",
            icon: <BrainCircuit className="h-6 w-6" />,
            details: "Get immediate feedback and track your performance. Challenge yourself and improve!"
        },
        {
            title: "Test Mode",
            description: "Simulate exam conditions with timed tests",
            icon: <Clock className="h-6 w-6" />,
            details: "Prepare for the real thing with timed tests created from your flash card sets."
        }
    ]

    const [activeFeature, setActiveFeature] = useState<string | null>(null)

    return <>
        <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                        {feature.icon}
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        <Button
                            variant="link"
                            className="mt-4 p-0"
                            onClick={() => setActiveFeature(activeFeature === feature.title ? null : feature.title)}
                        >
                            {activeFeature === feature.title ? "Hide details" : "Learn more"}
                        </Button>
                        {activeFeature === feature.title && (
                            <p className="mt-2 text-sm text-muted-foreground">{feature.details}</p>
                        )}
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                </Card>
            ))}
        </div>
    </>
}

function AIPart() {
    const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)
    const { toast } = useToast()
    const [inputValue, setInputValue] = useState('');
    const [sliderValue, setSliderValue] = useState<number>(33);
    const handleSliderChange = (event: any) => {
        setSliderValue(event.value);
    };


    const prompts = {
        table: "From this image, make an .csv file that is formatted in this way: \n\n[title of material] \n[word1], [word2] \n[word3], [word4] \n\nMake sure, if any of the words have \",\" in it, replace it with \"/\"",
        paragraph: "From this image, make flash card vocab based on this page, make it into a .csv file formatted like: \n[title of material]\n[word1], [word2]\n[word3], [word4] \n\nMake sure, if any of the words have \",\" in it, replace it with \"/\""
    }

    const copyToClipboard = (prompt: string) => {
        navigator.clipboard.writeText(prompt)
        setCopiedPrompt(prompt)
        toast({
            title: "Successfully copied",
            description: "Enjoy making flash cards!"
        })
    }

    return <>
        <span className="mb-2 mx-auto flex flex-row gap-1 items-center">
            Use the prompts below to generate a flash card set.
            <Popover>
                <PopoverTrigger className="text-blue-500 cursor-pointer font-semibold">
                    Format to Generate
                </PopoverTrigger>
                <PopoverContent className="rounded-2xl whitespace-pre w-fit">
                    [Title of Set]{"\n"}
                    [Word1, Word2]{"\n"}
                    [Word3, Word4]{"\n"}
                    [Word5, Word6]
                </PopoverContent>
            </Popover>
        </span>

        <Card className="w-full mx-auto">
            <CardContent>
                <Tabs defaultValue="table" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="table" className="flex items-center justify-center">
                            <AlignLeft className="h-4 w-4 mr-2" />
                            Vocabulary Format
                        </TabsTrigger>
                        <TabsTrigger value="paragraph" className="flex items-center justify-center">
                            <AlignLeft className="h-4 w-4 mr-2" />
                            Paragraph Format
                        </TabsTrigger>
                        <TabsTrigger value="Input" className="flex items-center justify-center">
                            <AlignLeft className="h-4 w-4 mr-2" />
                            Input Format
                        </TabsTrigger>
                    </TabsList>
                    {Object.entries(prompts).map(([key, prompt]) => (
                        <TabsContent key={key} value={key} className="mt-4">

                            <Card>
                                <CardContent className="pt-4">
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        Use this prompt to generate your flash cards:
                                    </p>
                                    <div className="relative">
                                        <ScrollArea className="w-full overflow-x-auto p-4 rounded bg-muted font-mono text-sm"> {/* Set a fixed height and allow vertical scrolling */}
                                            {prompt}
                                        </ScrollArea>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => copyToClipboard(prompt)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>

                            </Card>
                        </TabsContent>
                    ))}
                    <TabsContent value="Input">
                        <Card>
                            <CardContent className="pt-4">
                                <p className="mb-2 text-sm text-muted-foreground">
                                    Use this prompt to generate your flash cards:
                                </p>
                                <div className="relative">
                                    <div className="flex flex-col lg:flex-row gap-2">
                                        <div className="flex flex-col justify-between gap-1 w-[45%]">
                                            <Input type="text" placeholder="Input" className="my-auto w-full" onChange={(e) => setInputValue(e.target.value)} />
                                            `<div className="flex flex-row gap-2">
                                                <span>Cards:</span>
                                                <Slider defaultValue={[10]} max={50} step={1} value={[sliderValue]} onValueChange={([value]) => setSliderValue(value)} />
                                            </div>`

                                        </div>
                                        <ScrollArea className="w-full overflow-x-auto p-4 rounded bg-muted font-mono text-sm"> {/* Set a fixed height and allow vertical scrolling */}
                                            {`Make a flashcard set based on ${inputValue}. Make it into a .csv file formatted like: \n[title of material]\n[word1], [description of word 1]\n[word3], [description of word 4] \n\nMake sure, if any of the words have \",\" in it, replace it with \"/\". Make a deck of ${sliderValue} card${sliderValue > 1 && "s"}`}
                                        </ScrollArea>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => copyToClipboard(`Make a flashcard set based on ${inputValue}. Make it into a .csv file formatted like: \n[title of material]\n[word1], [description of word 1]\n[word3], [description of word 4] \n\nMake sure, if any of the words have \",\" in it, replace it with \"/\". Make a deck of ${sliderValue} card${sliderValue > 1 && "s"}`)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>

                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </>
}