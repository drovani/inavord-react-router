import { Button } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { PropsWithChildren } from "react";

function SaveButton({
    children,
    className,
    to,
    type = "button",
}: PropsWithChildren<Props>) {
    return (
        <Button
            type={type}
            className={`rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 ${className}`}
            as={Link}
            to={to}
        >
            {children}
        </Button>
    );
}

interface Props {
    className?: string;
    to: string;
    type?: "button" | "submit" | "reset";
}

export default SaveButton;
