"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, MousePointerClick, PlusCircle } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { useState, ChangeEvent } from "react";
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

// Define the Set interface
interface Set {
    title: string;
    vocab: [string, string][]; // Array of tuples with two strings
}

export default function LeftSide({
    pastSets,
    setPastSets,
    selected,
    setSelected
}: {
    pastSets: Set[],
    setPastSets: Function,
    selected: number | null,
    setSelected: Function
}) {

    const [open, setOpen] = useState(false);
    const [csvData, setCsvData] = useState<string[][]>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && file.type === "text/csv") {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target?.result as string;
                const { title, vocab } = parseCSV(text);
                setPastSets((prevSets: Set[]) => [
                    ...prevSets,
                    { title: title, vocab: vocab }
                ]);
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


    const FlashcardSets = () => (
        <>
            <div className="flex flex-row justify-between items-center mb-5 gap-1">
                <div className="hidden lg:flex flex-row gap-2">
                    <h2 className="text-1xl font-bold">flashcard/it</h2>
                    <Badge className="h-fit">.vercel.app</Badge>
                </div>
                <Dialog>
                    <DialogTrigger><Info /></DialogTrigger>
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
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-1">
                <Input id="picture" type="file" onChange={handleFileChange} />
            </div>
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
                    <div className="flex flex-col gap-2 my-2">
                        <div className="flex flex-row items-center w-full justify-between">
                            <Label htmlFor="setName">Set Name</Label>
                            <Input id="setName" className="max-w-[300px]" />
                        </div>
                    </div>
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Button className="mt-auto">Create Set</Button>
                </SheetContent>
            </Sheet>
            <h3 className="text-lg font-semibold mb-2">Past Sets</h3>
            <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-240px)]">
                {pastSets.map((set, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-between mb-2"
                        onClick={() => {
                            setOpen(false)
                            setSelected(index)
                        }}
                    >
                        {set.title}
                        {
                            selected == index && <MousePointerClick />
                        }
                    </Button>
                ))}
            </ScrollArea>
        </>
    );

    return (
        <>
            {/* Desktop view */}
            <div className="w-full hidden lg:block p-6 border-r">
                <FlashcardSets />
            </div>

            {/* Mobile-ish view */}
            <div className="w-full block lg:hidden p-6 border-r">
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger>Open</DrawerTrigger>
                    <DrawerContent className="h-[90vh] px-8">
                        <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                        <FlashcardSets />
                    </DrawerContent>
                </Drawer>
                <div className="flex flex-row gap-2">
                    <h2 className="text-1xl font-bold">flashcard/it</h2>
                    <Badge className="h-fit">.vercel.app</Badge>
                </div>
            </div>
        </>
    );
}
