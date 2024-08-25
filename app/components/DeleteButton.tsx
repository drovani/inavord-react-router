import { Button } from "@headlessui/react";
import { PropsWithChildren } from "react";

function DeleteButton({
    children,
    className,
    type = "submit",
}: PropsWithChildren<DeleteButtonProps>) {
    return (
        <Button
            type={type}
            className={`border-red-400 border-2 rounded-md px-2 shadow-sm bg-red-100 text-red-950 ${className}`}
        >
            {children}
        </Button>
    );
}

interface DeleteButtonProps {
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default DeleteButton;
