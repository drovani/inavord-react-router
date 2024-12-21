import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, type UIMatch } from "react-router";
import invariant from "tiny-invariant";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { heroDAL } from "~/lib/hero-dal";
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

  const allHeroes = await heroDAL.getAllHeroes();

  const currentIndex = allHeroes.findIndex((h) => h.slug === hero.slug);
  const prevHero = currentIndex > 0 ? allHeroes[currentIndex - 1] : null;
  const nextHero = currentIndex < allHeroes.length - 1 ? allHeroes[currentIndex + 1] : null;

  return { hero, prevHero, nextHero };
};

export default function Hero({ loaderData }: Route.ComponentProps) {
  const { hero, prevHero, nextHero } = loaderData;
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
        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-4xl">{hero.name[0]}</span>
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

      {/* Artifact Team Buff Section */}
      {hero.artifact_team_buff && (
        <Card>
          <CardHeader>
            <CardTitle>Artifact Team Buff</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="capitalize">
              {hero.artifact_team_buff}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Stone Sources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Stone Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {hero.stone_source.map((source) => (
              <Badge key={source} variant="outline">
                {source}
              </Badge>
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
