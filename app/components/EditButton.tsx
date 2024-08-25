import { Button } from "@headlessui/react";
import { PropsWithChildren } from "react";

function EditButton({
    children,
    className,
    type = "submit",
}: PropsWithChildren<EditButtonProps>) {
    return (
        <Button
            type={type}
            className={`border-blue-400 border-2 rounded-md px-2 shadow-sm bg-blue-100 text-blue-950 ${className}`}
        >
            {children}
        </Button>
    );
}

interface EditButtonProps {
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default EditButton;
