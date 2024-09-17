import formsPlugin from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    safelist: [],
    theme: {
        extend: {},
    },
    plugins: [formsPlugin],
} satisfies Config;
