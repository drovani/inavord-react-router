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
export function parseSlugGetImageUrl(slug: string, extension: string = "png"): string {
  const goodslug = slug.indexOf("-fragment") < 0 ? slug : slug.substring(0, slug.length - "-fragment".length);
  return `/images/equipment/${goodslug}.${extension}`;
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
