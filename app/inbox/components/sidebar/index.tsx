"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Search, Settings, PenSquare } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface SidebarProps {
    children: React.ReactNode;
}

export const Sidebar = ({
    children
}: SidebarProps) => {
    return (
        <aside className="fixed z-[1] left-0 bg-card h-full w-[300px] hidden lg:flex flex-col border-r border-border">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <Link href="/">
                    <div className="flex items-center gap-x-4">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            height={40}
                            width={40}
                            className="rounded-full"
                        />
                        <span className={cn(
                            "font-semibold text-xl text-foreground",
                            font.className,
                        )}>
                            Ploy Chat
                        </span>
                    </div>
                </Link>
            </div>

            {/* Messages Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <span className="text-lg font-semibold text-foreground">Messages</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                >
                    <PenSquare size={20} />
                </Button>
            </div>

            {/* Search */}
            <div className="px-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search messages"
                        className="w-full bg-secondary rounded-xl py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>

            {/* Settings */}
            <div className="p-4 border-t border-border mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-x-2 text-muted-foreground hover:text-foreground"
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Button>
            </div>
        </aside>
    );
};