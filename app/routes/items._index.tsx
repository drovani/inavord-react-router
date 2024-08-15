import { Link, useLoaderData } from "@remix-run/react";
import { getItems, ItemRecord } from "../data";

const color_map: { [key: string]: { from: string, to: string } } = {
    gray: { from: 'gray-300', to: 'gray-900' },
    default: { from: 'white', to: 'black' }
}

export const loader = async () => {
    const items = await getItems();
    return { items };
}

const border_gradient = (item: ItemRecord) => {
    return color_map[item.item_quality || 'default']
}

export default function ItemIndex() {
    const { items } = useLoaderData<typeof loader>();

    return (
        <div>
            {items.length ? (
                <div>
                    {items.map((item) => (
                        <div key={item.id}>
                            <Link to={`/items/${item.slug}`} className="block">
                                <div className={`rounded-3xl w-24 h-24 p-1 bg-gradient-to-br from-${border_gradient(item).from} to-${border_gradient(item).to}`}>
                                    <div className="overflow-hidden rounded-[calc(1.5rem-1px)] bg-white bg-clip-padding">
                                        <img
                                            alt={`${item.name} icon`}
                                            key={item.slug}
                                            src={`/images/items/${item.slug}.png`}
                                        />
                                    </div>
                                </div>
                                {item.name}
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (<p>No items found.</p>)}
        </div>
    )
}