import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    TransitionChild,
} from "@headlessui/react";
import { ChevronDoubleRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import ButtonBar from "~/components/ButtonBar";
import { getAllEquipment } from "../data";

export const loader = async () => {
    const equipments = await getAllEquipment();
    return { equipments };
};

export default function Equipment() {
    const { equipments } = useLoaderData<typeof loader>();
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-row min-h-screen max-w-4xl">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group flex flex-col items-start pt-3 bg-gray-700 text-white"
            >
                <ChevronDoubleRightIcon className="w-8 group-data-[open]:rotate-180" />
                <div className="rotate-90 w-8 pl-1 text-3xl font-bold">
                    Equipment
                </div>
            </button>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-100 ease-in-out data-[closed]:opacity-0"
                />
                <div className="fixed inset-0 overflow-hidden">
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                            <DialogPanel
                                transition
                                className="pointer-events-auto relative w-screen max-w-md transform transition duration-100 ease-in-out data-[closed]:-translate-x sm:duration-100 "
                            >
                                <TransitionChild>
                                    <div className="absolute right-0 top-0 mr-8 flex pl-2 pt-4 duration-100 ease-in-out data-[closed]:opacity-0 sm:pl-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                        >
                                            <span className="absolute -inset-2.5" />
                                            <span className="sr-only">
                                                Close panel
                                            </span>
                                            <XMarkIcon
                                                aria-hidden="true"
                                                className="h-6 w-6"
                                            />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <div className="flex h-full flex-col bg-gray-700 text-white py-6 shadow-xl">
                                    <div className="px-4 sm:px-6">
                                        <DialogTitle
                                            as={Link}
                                            to="/equipment/"
                                            className="text-3xl font-bold leading-6"
                                            onClick={() => setOpen(false)}
                                        >
                                            Equipment
                                        </DialogTitle>
                                    </div>
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                        {equipments.length ? (
                                            <div className="flex flex-col items-start">
                                                {equipments.map((equipment) => (
                                                    <Link
                                                        key={equipment.slug}
                                                        to={`/equipment/${equipment.slug}`}
                                                        onClick={() =>
                                                            setOpen(false)
                                                        }
                                                    >
                                                        {equipment.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No equipment found</p>
                                        )}
                                    </div>
                                </div>
                                <ButtonBar className="">
                                    <Link
                                        to="/equipment/new"
                                        className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                        onClick={() => setOpen(false)}
                                    >
                                        New
                                    </Link>
                                    <Link
                                        to="/equipment.json"
                                        download={true}
                                        reloadDocument
                                        className={`rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600`}
                                    >
                                        Export
                                    </Link>
                                </ButtonBar>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>
            <div className="py-4 sm:py-6 lg:py-8 pl-4">
                <Outlet />
            </div>
        </div>
    );
}
