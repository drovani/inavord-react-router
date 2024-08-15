import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getItems } from "../data";

export const loader = async () => {
    const items = await getItems();
    return { items };
}

export default function Items() {
    const { items } = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-row">
            <div className="bg-gray-700 text-white px-1 basis-1/2 lg:basis-1/3 xl:basis-1/4 h-screen">
                <h2 className="text-2xl font-bold border-b-white border-b-2">Items</h2>
                {items.length ? (
                    <ul>
                        {items.map((item) => (
                            <li key={item.name} className="text-lg pl-6 -indent-6">
                                <Link to={`/items/${item.slug}`}>
                                    <img
                                        alt={`${item.name} icon`}
                                        key={item.slug}
                                        src={`/images/items/${item.slug}.png`}
                                        className="hidden md:inline h-5 w-5 mr-1 rounded-sm"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items found</p>
                )}
            </div>
            <div className="py-4 sm:py-6 lg:py-8 pl-4">
                <Outlet />
            </div>
        </div>
    )
}