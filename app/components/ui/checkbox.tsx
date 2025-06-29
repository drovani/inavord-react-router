import { Indicator, Root } from "@radix-ui/react-checkbox";
import { type ClassValue } from "clsx";
import { CheckIcon } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";

const Checkbox = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root> & {
    className?: ClassValue;
  }
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      "peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <Indicator className={cn("flex items-center justify-center text-current")}>
      <CheckIcon className="size-4" />
    </Indicator>
  </Root>
));
Checkbox.displayName = Root.displayName;

export { Checkbox };
