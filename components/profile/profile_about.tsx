import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';

interface AboutSectionProps {
    initialAbout?: string;
    userId: Id<"users">;
}

const AboutSection = ({ initialAbout, userId }: AboutSectionProps) => {
    const [about, setAbout] = useState(initialAbout || '');
    const [isEditing, setIsEditing] = useState(false);
    const updateAbout = useMutation(api.users.updateAbout);

    const handleSave = async () => {
        try {
            await updateAbout({
                about: about,
                userId: userId
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update about:', error);
        }
    };

    return (
        <div className="border-t py-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-medium">About Me</h3>
                    <p className="text-sm text-muted-foreground">Add a short bio to your profile</p>
                </div>
                {!isEditing && (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </Button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <Textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Write a little bit about yourself..."
                        className="min-h-[100px]"
                    />
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setAbout(initialAbout || '');
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    {about || 'No bio added yet'}
                </p>
            )}
        </div>
    );
};

export default AboutSection;