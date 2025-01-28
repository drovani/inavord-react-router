import { Link } from "react-router";
import { type HeroRecord } from "~/data/hero.zod";
import { Card, CardHeader } from "../ui/card";

export default function HeroCard({ hero }: { hero: HeroRecord }) {
  return (
    <Link to={`/heroes/${hero.slug}`} key={hero.slug} viewTransition>
      <Card
        className={
          "bg-cover h-28 w-28 relative bg-center hover:scale-110 transition-all duration-500 hover:bg-transparent"
        }
        style={{
          backgroundImage: `url('/images/heroes/${hero.slug}.png')`,
        }}
      >
        <CardHeader className="p-1 bottom-0 absolute w-full text-center bg-white/80">
          <div className="font-semibold">{hero.name}</div>
        </CardHeader>
      </Card>
    </Link>
  );
}
