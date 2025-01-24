import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { HeroRecord } from "~/data/hero.zod";
import { generateSlug } from "~/lib/utils";

interface HeroGlyphsProps {
  hero: HeroRecord;
}

export default function HeroGlyphs({ hero }: HeroGlyphsProps) {
  if (!hero.glyphs) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Glyphs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {hero.glyphs.map((glyph, index) => (
            <div key={index} className="flex flex-col text-center items-center gap-2 p-2 border rounded-lg">
              <img
                src={`/images/stats/${generateSlug(glyph || "placeholder")}.png`}
                alt={glyph || "No glyph selected"}
                className="w-8 h-8"
              />
              <div className="font-medium capitalize">{glyph}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
