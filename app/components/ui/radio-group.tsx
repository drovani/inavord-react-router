import { Indicator, Item, Root } from "@radix-ui/react-radio-group";
import { type ClassValue } from "clsx";
import { Circle } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";

const RadioGroup = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root> & {
    className?: ClassValue;
  }
>(({ className, ...props }, ref) => {
  return <Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = Root.displayName;

const RadioGroupItem = forwardRef<
  React.ComponentRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item> & {
    className?: ClassValue;
  }
>(({ className, ...props }, ref) => {
  return (
    <Item
      ref={ref}
      className={cn(
        "aspect-square size-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </Indicator>
    </Item>
  );
});
RadioGroupItem.displayName = Item.displayName;

export { RadioGroup, RadioGroupItem };
