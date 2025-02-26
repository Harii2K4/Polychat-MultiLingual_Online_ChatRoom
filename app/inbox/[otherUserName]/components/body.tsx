import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageWithUserType } from "@/types";
import MessageBox from "./message-box";
import { Id } from "@/convex/_generated/dataModel";
import { ChevronDown, Globe } from "lucide-react";

interface BodyProps {
    messages: MessageWithUserType[];
    conversationId: Id<"conversations">;
    currentUserId: Id<'users'>;
    otherUser: string;
}

const Body = ({ messages, conversationId, currentUserId, otherUser }: BodyProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const markMessagesAsSeen = useMutation(api.messages.markAsSeen);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const updateLanguage = useMutation(api.conversations.updateParticipantLanguage);
    const getLanguage = useQuery(api.conversations.getParticipantLanguage, { userid: currentUserId, username: otherUser });
    console.log(getLanguage)
    const [selectedLanguage, setSelectedLanguage] = useState("");

    useEffect(() => {
        if (getLanguage) {
            setSelectedLanguage(getLanguage);
        }
    }, [getLanguage])

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
            const unseenMessages = messages.filter(
                (msg) => !msg.seen && msg.userId !== currentUserId
            );
            if (unseenMessages.length > 0) {
                markMessagesAsSeen({ conversationId });
            }
        }
    }, [messages, conversationId, currentUserId, markMessagesAsSeen]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectLanguage = async (language: string) => {
        setSelectedLanguage(language);
        setIsDropdownOpen(false);

        // Call the mutation to update the language
        try {
            await updateLanguage({
                userid: currentUserId,
                username: otherUser,
                language: language
            });
            console.log(`Language updated to ${language}`);
        } catch (error) {
            console.error("Failed to update language:", error);
            // Optionally add error handling UI here
        }
    };

    return (
        // Added pt-14 to account for the main header's height (h-14)
        <div className="relative min-h-screen flex flex-col pt-14">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 animate-gradient-xy"></div>

            {/* Animated mesh gradient overlay */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(192,132,252,0.1),transparent_50%)]"></div>
            </div>

            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute h-32 w-32 rounded-full bg-purple-200 blur-xl opacity-20 animate-float-slow left-1/4 top-1/4"></div>
                <div className="absolute h-40 w-40 rounded-full bg-blue-200 blur-xl opacity-20 animate-float-medium right-1/3 top-1/2"></div>
                <div className="absolute h-24 w-24 rounded-full bg-cyan-200 blur-xl opacity-20 animate-float-fast left-1/2 bottom-1/4"></div>
            </div>

            {/* Chat-specific header with dropdown - now positioned below the main header */}
            <div className="sticky top-14 z-10 flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white/60 backdrop-blur-md">
                <h3 className="font-semibold text-gray-800">Chat Messages</h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Chat Language Settings</span>
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/70 hover:bg-white/90 border border-gray-200 text-sm font-medium text-gray-700 transition-all"
                        >
                            <Globe size={14} className="text-gray-500" />
                            {selectedLanguage}
                            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100">
                                <ul className="py-1">
                                    {["English", "French"].map((language) => (
                                        <li key={language}>
                                            <button
                                                onClick={() => selectLanguage(language)}
                                                className={`block w-full text-left px-4 py-2 text-sm ${selectedLanguage === language ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {language}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content container */}
            <div
                ref={containerRef}
                className="
                    relative
                    flex-1 
                    overflow-y-auto 
                    pt-4
                    pb-6
                    space-y-2
                    scrollbar-thin 
                    scrollbar-thumb-gray-300 
                    scrollbar-track-transparent
                    hover:scrollbar-thumb-gray-400
                    transition-colors
                    backdrop-blur-sm
                    bg-white/30
                "
            >
                <div className="min-h-full">
                    {messages.map((message, i) => (
                        <MessageBox
                            isLast={i === messages.length - 1}
                            key={message._id}
                            selectedLang={getLanguage || "English"}
                            message={message}
                        />
                    ))}
                    <div className="pt-8" ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};

export default Body;