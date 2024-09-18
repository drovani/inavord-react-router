import { nextui } from "@nextui-org/react";
import formsPlugin from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
    content: [
        "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [formsPlugin, nextui()],
} satisfies Config;
