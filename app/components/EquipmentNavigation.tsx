import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import type { EquipmentRecord } from "~/data/equipment.zod";

const EquipmentNavigation = ({ prevEquipment, nextEquipment }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full">
      <div className="flex justify-start w-full sm:w-auto">
        {prevEquipment ? (
          <Link
            to={`/equipment/${prevEquipment.slug}`}
            className={buttonVariants({ variant: "outline" })}
            viewTransition
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {prevEquipment.name}
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex justify-center w-full sm:w-auto">
        <Link to="/equipment" className={buttonVariants({ variant: "secondary" })} viewTransition>
          All Equipment
        </Link>
      </div>

      <div className="flex justify-end w-full sm:w-auto">
        {nextEquipment ? (
          <Link
            to={`/equipment/${nextEquipment.slug}`}
            className={buttonVariants({ variant: "outline" })}
            viewTransition
          >
            {nextEquipment.name}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

interface Props {
  prevEquipment?: EquipmentRecord;
  nextEquipment?: EquipmentRecord;
}

export default EquipmentNavigation;
