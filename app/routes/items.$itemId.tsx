import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { getItem, ItemRecord } from "~/data";

const color_map: { [key: string]: { from: string, to: string } } = {
    gray: { from: 'gray-300', to: 'gray-900' },
    default: { from: 'white', to: 'black' }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.itemId, "Expected params.itemId");

    return json({ item: await getItem(params.itemId) });
}

export default function Item() {

    const { item } = useLoaderData() as { item: ItemRecord };

    const border_gradient = useMemo(() => {
        return color_map[item.item_quality || 'default']
    }, [item.item_quality])


    return (
        <div id={`item-${item.slug}`}
            className="flex space-x-4 flex-col lg:flex-row" >
            <div className="flex space-x-4">
                <div className={`rounded-3xl w-24 h-24 p-1 bg-gradient-to-br from-${border_gradient.from} to-${border_gradient.to}`}>
                    <div className="overflow-hidden rounded-[calc(1.5rem-1px)] bg-white bg-clip-padding">
                        <img
                            alt={`${item.name} icon`}
                            key={item.slug}
                            src={`/images/items/${item.slug}.png`}
                        />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{item.name}</h2>
                    <div>Required level: {item.level_required}</div>
                    <div>Purchase: {item.buy} gold</div>
                    <div>Sell:
                        <ul className="ml-8 -mt-6">
                            <li>{item.sell?.gold} gold</li>
                            <li>{item.sell?.guild_activity_points} guild activity points</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                {item.chapters?.length
                    ? (
                        <>
                            <h3 className="text-xl font-semibold">Found in:</h3>
                            {item.chapters?.map((chptr) => {
                                return <div key={chptr}>{chptr}</div>
                            })}
                        </>
                    ) : (
                        <div>Data not available</div>
                    )}
            </div>
        </div>
    )
}