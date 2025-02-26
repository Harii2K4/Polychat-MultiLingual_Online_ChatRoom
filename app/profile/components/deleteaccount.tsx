import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust path if needed
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { Loading } from "@/components/auth/loading";
import { useRouter } from 'next/navigation';

interface AccountDeletionProps {
    userId: Id<"users">;
}

const AccountDeletion = ({ userId }: AccountDeletionProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const deleteUser = useMutation(api.users.deleteUser); // Convex mutation
    const { user } = useClerk(); // Clerk instance
    const router = useRouter();
    if (user == null || user == undefined) {
        return <Loading />
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // Delete user from Convex
            await deleteUser({ userId });

            // Delete user from Clerk
            await user.delete();

            // Redirect or show success message
            router.push("/goodbye");  // Adjust if needed
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button variant="destructive" onClick={() => setIsOpen(true)}>Delete Account</Button>

            {/* Confirmation Modal */}
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent. Your account and all associated data will be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AccountDeletion;
