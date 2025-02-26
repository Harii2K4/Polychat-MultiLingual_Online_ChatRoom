'use client';

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { useState } from "react";
import { HiPaperAirplane } from "react-icons/hi2";

interface FormProps {
    userId: Doc<"users">["_id"];
    conversationId: Doc<"conversations">["_id"];
    otherUser: string;
}

const Form = ({
    userId,
    conversationId,
    otherUser
}: FormProps) => {
    const getLanguage = useQuery(api.conversations.getParticipantLanguage, { userid: userId, username: otherUser });
    const [text, setText] = useState<string>("");
    const { mutate, pending } = useApiMutation(api.messages.send);

    // Function to translate text if needed
    const translateText = async (text: string, lang: string) => {
        try {
            const response = await fetch("http://localhost:8000/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, lang }),
            });

            const data = await response.json();
            return data.translated_text;
        } catch (error) {
            console.error("Translation API error:", error);
            return text; // Return original text on failure
        }
    };

    const handleSubmit = async () => {
        if (text === "") return;

        let Engtext = text;
        let Frenchtext = null;

        if (getLanguage === "English") {
            Frenchtext = await translateText(text, "English");
        } else {
            Frenchtext = text;
            Engtext = await translateText(text, "French");
        }

        mutate({
            userId,
            Engtext,
            Frenchtext,
            seen: false,
            conversationId,
        })
            .then(() => setText(""))
            .catch((error) => console.error(error));
    };

    return (
        <div className="fixed bottom-0 p-4 bg-zinc-100 border-2 flex items-center gap-2 lg:gap-4 w-full">
            <div className="flex items-center gap-2 lg:gap-4 w-full">
                <div className="relative w-full">
                    <input
                        placeholder="Enter message..."
                        className="text-black font-light py-2 px-4 bg-zinc-50 w-full rounded-full focus:outline-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
                    onClick={handleSubmit}
                    disabled={pending}
                >
                    <HiPaperAirplane size={18} className="text-white" />
                </button>
            </div>
        </div>
    );
}

export default Form;
