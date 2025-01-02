// heroes.$slug_.edit.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect, type UIMatch } from "react-router";
import invariant from "tiny-invariant";
import { ZodError } from "zod";
import HeroForm from "~/components/HeroForm";
import { Badge } from "~/components/ui/badge";
import { HeroMutationSchema, type HeroMutation } from "~/data/hero.zod";
import { heroDAL } from "~/lib/hero-dal";
import type { Route } from "./+types/heroes.$slug_.edit";

export const meta = ({ data }: Route.MetaArgs) => {
  return [{ title: `Edit ${data?.hero.name}` }];
};

export const handle = {
  breadcrumb: (matches: UIMatch<Route.ComponentProps["loaderData"], unknown>) => [
    {
      href: `/heroes/${matches.params.slug}`,
      title: matches.data?.hero?.name || "Hero",
    },
    {
      title: "Edit",
    },
  ],
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  invariant(params.slug, "Missing hero slug param.");
  const hero = await heroDAL.getHero(params.slug);
  if (!hero) {
    throw new Response(null, {
      status: 404,
      statusText: `Hero with slug ${params.slug} not found.`,
    });
  }

  return { hero };
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  invariant(params.slug, "Missing hero slug param");

  const formData = await request.formData();
  const data = JSON.parse(formData.get("hero") as string);

  try {
    const validated = HeroMutationSchema.parse(data);
    const updatedHero = await heroDAL.updateHero(params.slug, validated);
    return redirect(`/heroes/${updatedHero.slug}`);
  } catch (error) {
    if (error instanceof ZodError) {
      return data({ errors: error.format() }, { status: 400 });
    }
    throw error;
  }
};

export default function EditHero({ loaderData }: Route.ComponentProps) {
  const { hero } = loaderData;

  const form = useForm<HeroMutation>({
    resolver: zodResolver(HeroMutationSchema),
    defaultValues: hero,
  });

  return (
    <div className="space-y-6">
      {/* Hero Info Header */}
      <div className="flex items-center gap-4">
        <img src={`/images/heroes/${hero.slug}.png`} alt={hero.name} className="size-24 rounded-lg bg-muted" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{hero.name}</h1>
          <div className="flex gap-2">
            <Badge variant="secondary" className="capitalize">
              {hero.class}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {hero.faction}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {hero.main_stat}
            </Badge>
          </div>
        </div>
      </div>

      <HeroForm form={form} hero={hero} />
    </div>
  );
}
