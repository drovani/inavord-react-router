import { Button } from "@headlessui/react";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import slugify from "slugify";
import { CampaignChapters } from "~/constants";

export const loader = async () => {
    const campaign = CampaignChapters;
    return { campaign };
};

export default function Campaign() {
    const { campaign } = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-row">
            <div className="bg-gray-700 text-white px-1 basis-1/2 lg:basis-1/3 xl:basis-1/4 h-screen">
                <h2 className="text-2xl font-bold border-b-white border-b-2">
                    Equipment
                </h2>
                <div className="flex p-2 gap-3">
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search campaign"
                            placeholder="Search"
                            type="search"
                            name="q"
                        />
                        <div id="search-spinner" aria-hidden hidden={true} />
                    </Form>
                    <Form id="new-equipment" method="post">
                        <Button type="submit">New</Button>
                    </Form>
                </div>
                {campaign.length ? (
                    <ul>
                        {campaign.map((chapter) => (
                            <li
                                key={chapter.name}
                                className="text-lg pl-6 -indent-6"
                            >
                                <Link to={`/campaign/${slugify(chapter.slug)}`}>
                                    {chapter.chapter}-{chapter.level}{" "}
                                    {chapter.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No campaign chapters found</p>
                )}
            </div>
            <div className="py-4 sm:py-6 lg:py-8 pl-4">
                <Outlet />
            </div>
        </div>
    );
}
