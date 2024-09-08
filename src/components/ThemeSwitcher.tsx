// components/ThemeSwitcher.js
"use client"
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Computer, MoonStar, Sun } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ThemeSwitcher() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <Computer />;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className='flex flex-row gap-2 font-bold'>
                        {
                            theme === 'dark' ? <MoonStar /> : theme === 'light' ? <Sun /> : <Computer />
                        }
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='dark:bg-slate-900 dark:text-white'>
                    <DropdownMenuItem className="flex flex-row gap-2" onClick={() => setTheme('dark')}>
                        <MoonStar /> Dark Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-row gap-2" onClick={() => setTheme('light')}>
                        <Sun /> Light Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-row gap-2" onClick={() => setTheme('system')}>
                        <Computer /> System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}