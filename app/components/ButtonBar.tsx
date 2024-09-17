import { PropsWithChildren } from "react";

function ButtonBar({ children, className }: PropsWithChildren<Props>) {
    return (
        <div
            className={`${className} flex items-center justify-end gap-x-6 fixed bottom-0 w-fit bg-white p-4 rounded-t-lg`}
        >
            {children}
        </div>
    );
}

interface Props {
    className?: string;
}

export default ButtonBar;
