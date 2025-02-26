// components/header/index.tsx
"use client";

import { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { ProfileButton } from '../profile/profile-button';

export function Header() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Search users query
    const searchResults = useQuery(api.users.searchUsers, {
        searchQuery: searchQuery
    });

    return (
        <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    {/* Logo or Brand */}
                    <a href="/" className="font-bold text-xl">
                        Poly Chat
                    </a>

                    {/* Search Bar */}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-8 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="Users">
                                        {searchResults?.map((user) => (
                                            <CommandItem
                                                key={user._id}
                                                onSelect={() => {
                                                    router.push(`/profile/${user.username}`);
                                                    setOpen(false);
                                                    setSearchQuery("");
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.profileImageUrl} />
                                                        <AvatarFallback>
                                                            {user.fullName?.charAt(0) || user.username?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.fullName}</p>
                                                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-4">
                    <ProfileButton />
                </div>
            </div>
        </header>
    );
}