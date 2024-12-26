import { Link } from "react-router";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { heroDAL } from "~/lib/hero-dal";
import type { Route } from "./+types/heroes._index";

export const loader = async (_: Route.LoaderArgs) => {
  const heroes = await heroDAL.getAllHeroes();

  return { heroes };
};

export default function HeroesIndex({ loaderData }: Route.ComponentProps) {
  const { heroes } = loaderData;
  return (
    <div>
      {heroes.length ? (
        <div className="gap-2 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {heroes.map((hero) => (
            <Link to={`/heroes/${hero.slug}`} key={hero.slug} viewTransition>
              <Card
                className={"bg-cover h-28 w-28 relative bg-center hover:scale-110 transition-all duration-500 hover:bg-transparent"}
                style={{
                  backgroundImage: `url('/images/heroes/${hero.slug}.png')`,
                }}
              >
                <CardHeader className="p-1 bottom-0 absolute w-full text-center bg-white/80">
                  <CardTitle className="text-base">{hero.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>No heroes found.</p>
      )}
    </div>
  );
}
