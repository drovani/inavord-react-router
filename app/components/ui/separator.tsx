import { Root } from "@radix-ui/react-separator";
import { forwardRef } from "react";

import { type ClassValue } from "clsx";
import { cn } from "~/lib/utils";

const Separator = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root> & {
    className?: ClassValue;
    orientation?: "horizontal" | "vertical" | undefined;
    decorative?: boolean;
  }
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
));
Separator.displayName = Root.displayName;

export { Separator };
