import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-white shadow hover:bg-destructive/80",
        outline: "text-foreground",
        // Info variants (Bleu) - Utilise les variables CSS
        info: "border-transparent bg-info text-info-foreground shadow hover:opacity-90",
        "info-light":
          "border-transparent bg-info-lighter text-info-foreground shadow hover:opacity-90",
        "info-dark":
          "border-transparent bg-info-darker text-info-foreground shadow hover:opacity-90",
        "info-outline": "border-info text-info bg-transparent hover:bg-info/10",
        // Success variants (Vert) - Utilise les variables CSS
        success:
          "border-transparent bg-success text-success-foreground shadow hover:opacity-90",
        "success-light":
          "border-transparent bg-success-lighter text-success-foreground shadow hover:opacity-90",
        "success-dark":
          "border-transparent bg-success-darker text-success-foreground shadow hover:opacity-90",
        "success-outline":
          "border-success text-success bg-transparent hover:bg-success/10",
        // Danger variants (Rouge) - Utilise les variables CSS
        danger:
          "border-transparent bg-danger text-danger-foreground shadow hover:opacity-90",
        "danger-light":
          "border-transparent bg-danger-lighter text-danger-foreground shadow hover:opacity-90",
        "danger-dark":
          "border-transparent bg-danger-darker text-danger-foreground shadow hover:opacity-90",
        "danger-outline": "border-danger text-danger bg-transparent hover:bg-danger/10",
        // Warning variants (Jaune) - Utilise les variables CSS
        warning:
          "border-transparent bg-warning text-warning-foreground shadow hover:opacity-90",
        "warning-light":
          "border-transparent bg-warning-lighter text-warning-foreground shadow hover:opacity-90",
        "warning-dark":
          "border-transparent bg-warning-darker text-warning-foreground shadow hover:opacity-90",
        "warning-outline":
          "border-warning text-warning bg-transparent hover:bg-warning/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
