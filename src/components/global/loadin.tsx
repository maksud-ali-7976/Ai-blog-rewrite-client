"use client"
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    label?: string;
    className?: string;
    fullScreen?: boolean;
}

export default function LoadingSpinner({
    size = "md",
    label = "Loading…",
    className,
    fullScreen = false,
}: LoadingSpinnerProps) {
    const sizeMap = {
        sm: "h-6 w-6",
        md: "h-10 w-10",
        lg: "h-16 w-16",
    };

    const dotSize = {
        sm: "h-1.5 w-1.5",
        md: "h-2.5 w-2.5",
        lg: "h-3.5 w-3.5",
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4",
                fullScreen && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
                !fullScreen && "py-12",
                className
            )}
        >
            {/* Animated rings */}
            <div className={cn("relative", sizeMap[size])}>
                <div
                    className={cn(
                        "absolute inset-0 rounded-full border-2 border-primary/20"
                    )}
                />
                <div
                    className={cn(
                        "absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
                    )}
                />
                <div
                    className={cn(
                        "absolute inset-1 rounded-full border-2 border-transparent border-b-accent animate-spin"
                    )}
                    style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                />
            </div>

            {/* Bouncing dots */}
            <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className={cn(
                            dotSize[size],
                            "rounded-full bg-primary animate-bounce"
                        )}
                        style={{ animationDelay: `${i * 150}ms` }}
                    />
                ))}
            </div>

            {label && (
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    {label}
                </p>
            )}
        </div>
    );
}
