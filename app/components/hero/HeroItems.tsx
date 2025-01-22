import { AlertCircle } from "lucide-react";
import { Link } from "react-router";
import type { EquipmentRecord } from "~/data/equipment.zod";
import type { HeroRecord } from "~/data/hero.zod";
import EquipmentImage from "../EquipmentImage";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface HeroItemsProps {
  equipment: EquipmentRecord[];
  items: HeroRecord["items"];
}

export default function HeroItems({ items, equipment }: HeroItemsProps) {
  if (items === undefined) return null;

  // Group together item ranks by their tier color
  const groups: Record<string, { [key: string]: EquipmentRecord[] }> = {};

  const itemTiers = Object.entries(items);
  for (const [tierName, tierItemSlugs] of itemTiers) {
    const group = tierName.split("+")[0];

    const tierItems = tierItemSlugs
      .map((slug) => equipment.find((e) => e.slug === slug))
      .filter((item): item is EquipmentRecord => items !== undefined);
    groups[group] = { ...groups[group], [tierName]: tierItems };
  }

  if (!items || Object.keys(items).length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <span>No items configured for this hero</span>
      </div>
    );
  }
  return (
    <Tabs orientation="vertical" className="w-full">
      <Card>
        <CardHeader className="flex items-center flex-row gap-2">
          <CardTitle>Equipment Ranks:</CardTitle>
          <TabsList defaultValue="white" className="bg-white">
            {Object.keys(groups).map((group) => (
              <TabsTrigger key={group} value={group} className="capitalize text-md data-[state=active]:bg-muted">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        <CardContent>
          {Object.entries(groups).map(([group, tiers]) => (
            <TabsContent key={group} value={group} className="grid grid-cols-1">
              {Object.entries(tiers).map(([tier, items]) => (
                <Card key={tier}>
                  <CardHeader className="capitalize">{tier}</CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2">
                      {items.map((item, index) =>
                        item ? (
                          <Link to={`/equipment/${item.slug}`} key={index} className={`group flex items-center gap-2`}>
                            <EquipmentImage equipment={item} size={"md"} />
                            <span className="group-hover:underline">{item.name}</span>
                          </Link>
                        ) : (
                          <img
                            src={`/images/equipment/border-${group.split("+")[0].replace("white", "gray")}.png`}
                            alt={`Empty ${group} slot`}
                            className="size-16"
                            key={index}
                          />
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </CardContent>
      </Card>
    </Tabs>
  );
}
