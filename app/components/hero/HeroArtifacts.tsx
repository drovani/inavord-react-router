import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { HeroRecord } from "~/data/hero.zod";
import { ArtifactBookStats } from "~/data/ReadonlyArrays";
import { generateSlug } from "~/lib/utils";

interface HeroArtifactsProps {
  hero: HeroRecord;
}

export default function HeroArtifacts({ hero }: HeroArtifactsProps) {
  if (!hero.artifacts) return null;

  return (
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
              onError={(e) => {
                e.currentTarget.src = "/images/heroes/border-white.png";
              }}
            />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="capitalize">
                Activation chance
              </Badge>
              {hero.artifacts.weapon.team_buff.map((buff) => (
                <div key={buff} className="capitalize flex gap-1">
                  <img src={`/images/stats/${generateSlug(buff)}.png`} alt={buff} className="w-6 h-6" />
                  {buff}
                </div>
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
              {ArtifactBookStats[hero.artifacts.book].map((stat) => (
                <div key={stat} className="capitalize flex gap-1">
                  <img src={`/images/stats/${generateSlug(stat)}.png`} alt={stat} className="w-6 h-6" />
                  {stat}
                </div>
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
            <div className="capitalize flex gap-2">
              <img src={`/images/stats/${generateSlug(hero.main_stat)}.png`} alt={hero.main_stat} className="w-6 h-6" />
              {hero.main_stat}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
