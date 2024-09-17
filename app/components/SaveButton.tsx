import { Button } from "@headlessui/react";
import { PropsWithChildren } from "react";

function SaveButton({
    children,
    className,
    type = "submit",
}: PropsWithChildren<Props>) {
    return (
        <Button
            type={type}
            className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
        >
            {children}
        </Button>
    );
}

interface Props {
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default SaveButton;
