import { XIcon } from "lucide-react";
import EquipmentImage from "~/components/EquipmentImage";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type EquipmentRecord } from "~/data/equipment.zod";
import { type HeroQualityLevel } from "~/data/hero.zod";

interface ItemSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (equipmentSlug: string | null) => void;
  equipment: EquipmentRecord[];
  quality: HeroQualityLevel;
}

export default function ItemSelectionDialog({ open, onClose, onSelect, equipment, quality }: ItemSelectionDialogProps) {
  const availableEquipment = equipment;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">Select {quality.replace("+", " +")} Equipment</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Empty slot option */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 justify-start p-2 h-16"
              onClick={() => {
                onSelect(null);
                onClose();
              }}
            >
              <div className="size-12 bg-muted rounded flex items-center justify-center">
                <XIcon className="size-6 text-muted-foreground" />
              </div>
              <span>Empty Slot</span>
            </Button>
            {/* Equipment options */}
            {availableEquipment.map((equip) => (
              <Button
                key={equip.slug}
                variant="ghost"
                className="flex items-center gap-2 justify-start p-2 h-16"
                onClick={() => {
                  onSelect(equip.slug);
                  onClose();
                }}
              >
                <div className="size-16">
                  <EquipmentImage equipment={equip} size="md" />
                </div>
                <span className="text-sm">{equip.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
