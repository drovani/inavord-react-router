import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function generateSlug(text: string): string {
    return slugify(text, {
        lower: true, // Convert to lowercase
        strict: true, // Strip special characters
        trim: true, // Trim leading/trailing spaces
    });
}
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
