import { Button } from "@headlessui/react";
import { PropsWithChildren } from "react";

function NewButton({
    children,
    className,
    type = "submit",
}: PropsWithChildren<Props>) {
    return (
        <Button
            type={type}
            className={`border-blue-400 border-2 rounded-md px-2 shadow-sm bg-blue-100 text-blue-950 ${className}`}
        >
            {children}
        </Button>
    );
}

interface Props {
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default NewButton;
