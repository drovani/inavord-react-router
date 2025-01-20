// heroes.$slug_.edit.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect, type UIMatch } from "react-router";
import invariant from "tiny-invariant";
import { ZodError } from "zod";
import HeroForm from "~/components/HeroForm";
import { Badge } from "~/components/ui/badge";
import { HeroMutationSchema, type HeroMutation } from "~/data/hero.zod";
import EquipmentDataService from "~/services/EquipmentDataService";
import HeroDataService from "~/services/HeroDataService";
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
  const hero = await HeroDataService.getById(params.slug);
  if (!hero) {
    throw new Response(null, {
      status: 404,
      statusText: `Hero with slug ${params.slug} not found.`,
    });
  }

  const equipment = await EquipmentDataService.getEquipableEquipment();

  return { hero, equipment };
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  invariant(params.slug, "Missing hero slug param");

  const formData = await request.formData();
  const data = JSON.parse(formData.get("hero") as string);

  try {
    const validated = HeroMutationSchema.parse(data);
    const updateResults = await HeroDataService.update(params.slug, validated);
    if (updateResults instanceof ZodError) {
      return data({ errors: updateResults.format() }, { status: 400 });
    }

    return redirect(`/heroes/${updateResults.slug}`);
  } catch (error) {
    if (error instanceof ZodError) {
      return data({ errors: error.format() }, { status: 400 });
    }
    throw error;
  }
};

export default function EditHero({ loaderData }: Route.ComponentProps) {
  const { hero, equipment } = loaderData;

  const form = useForm<HeroMutation>({
    resolver: zodResolver(HeroMutationSchema),
    defaultValues: { ...hero, glyphs: hero.glyphs || [undefined, undefined, undefined, undefined, hero.main_stat],
      artifacts: hero.artifacts || {

      }
     },
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
            <div className="capitalize flex gap-1 items-center">
              <img src={`/images/stats/${hero.main_stat}.png`} alt={hero.main_stat} className="size-4 inline-block" />
              {hero.main_stat}
            </div>
          </div>
        </div>
      </div>

      <HeroForm form={form} hero={hero} equipment={equipment} />
    </div>
  );
}
