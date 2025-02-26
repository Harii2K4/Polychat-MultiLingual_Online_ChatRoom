"use client";
import { redirect } from "next/navigation";

export default function HomePage() {

    redirect("/inbox"); // Redirects root `/` to `/inbox`
    return null; // This ensures the page does not render anything
}
