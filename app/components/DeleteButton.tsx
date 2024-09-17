import { Button } from "@headlessui/react";
import { PropsWithChildren } from "react";

function DeleteButton({
    children,
    className,
    type = "submit",
}: PropsWithChildren<Props>) {
    return (
        <Button
            type={type}
            className={`rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${className}`}
        >
            {children}
        </Button>
    );
}

interface Props {
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default DeleteButton;
