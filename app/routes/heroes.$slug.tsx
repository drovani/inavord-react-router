import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, type UIMatch } from "react-router";
import invariant from "tiny-invariant";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { BOOK_STATS } from "~/data/hero.zod";
import { heroDAL } from "~/lib/hero-dal";
import { missionDAL } from "~/lib/mission-dal";
import { generateSlug } from "~/lib/utils";
import type { Route } from "./+types/heroes.$slug";

export const meta = ({ data }: Route.MetaArgs) => {
  return [{ title: data?.hero.name }];
};

export const handle = {
  breadcrumb: (match: UIMatch<Route.ComponentProps["loaderData"], unknown>) => ({
    href: match.pathname,
    title: match.data?.hero.name,
  }),
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  invariant(params.slug, "Missing hero slug param");

  const hero = await heroDAL.getHero(params.slug);
  if (!hero) {
    throw new Response(null, {
      status: 404,
      statusText: `Hero with slug ${params.slug} not found.`,
    });
  }

  const campaignSources = await missionDAL.getMissionsByBoss(hero.name);

  const allHeroes = await heroDAL.getAllHeroes();

  const currentIndex = allHeroes.findIndex((h) => h.slug === hero.slug);
  const prevHero = currentIndex > 0 ? allHeroes[currentIndex - 1] : null;
  const nextHero = currentIndex < allHeroes.length - 1 ? allHeroes[currentIndex + 1] : null;

  return { hero, prevHero, nextHero, campaignSources };
};

export default function Hero({ loaderData }: Route.ComponentProps) {
  const { hero, prevHero, nextHero, campaignSources } = loaderData;
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          if (prevHero) {
            navigate(`/heroes/${prevHero.slug}`);
          }
          break;
        case "ArrowRight":
          if (nextHero) {
            navigate(`/heroes/${nextHero.slug}`);
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, prevHero, nextHero]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start gap-6">
        <div className="size-32 bg-muted rounded">
          <img src={`/images/heroes/${hero.slug}.png`} alt={hero.name[0]} className="size-32" />
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{hero.name}</h1>
            <div className="flex gap-2">
              <Badge variant="secondary" className="capitalize">
                {hero.class}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {hero.faction}
              </Badge>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-sm space-y-2">
              <div>Main Stat:</div>
              <div className="font-semibold capitalize">{hero.main_stat}</div>
            </div>
            <div className="text-sm space-y-2">
              <div>Attack Types:</div>
              <div className="flex gap-2">
                {hero.attack_type.map((type) => (
                  <Badge key={type} variant="outline" className="capitalize">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artifacts Section */}
      {hero.artifacts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weapon Card */}
          <Card>
            <CardHeader>
              <CardTitle>{hero.artifacts.weapon.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="size-12 xl:size-16 aspect-square bg-muted rounded relative overflow-hidden">
                <img
                  src={`/images/heroes/artifacts/${generateSlug(hero.artifacts.weapon.name)}.png`}
                  alt={hero.artifacts.weapon.name}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="capitalize">
                    Activation chance
                  </Badge>
                  {hero.artifacts.weapon.team_buff.map((buff) => (
                    <Badge key={buff} variant="secondary" className="capitalize">
                      {buff}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Card */}
          <Card>
            <CardHeader>
              <CardTitle>{hero.artifacts.book}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="size-12 xl:size-16 aspect-square bg-muted rounded relative overflow-hidden">
                <img
                  src={`/images/heroes/artifacts/${generateSlug(hero.artifacts.book)}.png`}
                  alt={hero.artifacts.book}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  {BOOK_STATS[hero.artifacts.book].map((stat) => (
                    <Badge key={stat} variant="secondary" className="capitalize">
                      {stat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ring Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ring of {hero.main_stat}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="size-12 xl:size-16 aspect-square bg-muted rounded relative overflow-hidden">
                <img
                  src={`/images/heroes/artifacts/ring-of-${hero.main_stat}.png`}
                  alt={`Ring of ${hero.main_stat}`}
                  className="object-contain"
                />
              </div>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {hero.main_stat}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stone Sources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Stone Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {hero.stone_source
              .filter((s) => s !== "Campaign")
              .map((source) => (
                <Badge key={source} variant="outline">
                  {source}
                </Badge>
              ))}
            {campaignSources.length > 0 &&
              campaignSources.map((mission) => (
                <Link to={`/missions/${mission.id}`} key={mission.id}>
                  <Badge variant="outline">
                    {mission.chapter}-{mission.mission_number}: {mission.name}
                  </Badge>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link to={`/heroes/${hero.slug}/edit`} className={buttonVariants({ variant: "default" })} viewTransition>
          Edit
        </Link>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full">
        <div className="flex justify-start w-full sm:w-auto">
          {prevHero ? (
            <Link to={`/heroes/${prevHero.slug}`} className={buttonVariants({ variant: "outline" })} viewTransition>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {prevHero.name}
            </Link>
          ) : (
            <div />
          )}
        </div>
        <div className="flex justify-center w-full sm:w-auto">
          <Link to="/heroes" className={buttonVariants({ variant: "secondary" })} viewTransition>
            All Heroes
          </Link>
        </div>
        <div className="flex justify-end w-full sm:w-auto">
          {nextHero ? (
            <Link to={`/heroes/${nextHero.slug}`} className={buttonVariants({ variant: "outline" })} viewTransition>
              {nextHero.name}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
