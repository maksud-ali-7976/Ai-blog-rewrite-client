"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, ReactNode, useRef } from "react";
import AnimatedNumber from "./animated-number";
import { LucideIcon, TrendingUp } from "lucide-react";

export type Color =
    | "var(--primary)"
    | "var(--success)"
    | "var(--warning)"
    | "var(--chart-2)";

type Prop = {
    children?: ReactNode;
    className?: string;
    glowColor?: string;
    color?: Color;
    icon?: LucideIcon;
    title?: string;
    value?: number;
};

export default function AnimatedCard(props: Prop) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const color = props.color || "var(--primary)";
    const glow = props.glowColor || "var(--primary)";
    const Icon = props.icon;

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
        stiffness: 200,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
        stiffness: 200,
        damping: 20,
    });

    const handleMouse = (e: MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`group relative ${props.className}`}
        >
            {/* Glow */}
            <div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                    background: `rradial-gradient(circle, hsl(${props.glowColor} / 0.3), transparent 70%)`,
                }}
            />

            {/* Top gradient bar */}
            <div
                className="absolute top-0 left-0 h-1 w-full"
                style={{
                    background: `linear-gradient(90deg, hsl(${props.color}), hsl(${props.color} / 0.3))`,
                }}
            />

            <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                {/* Gradient accent bar */}
                <div
                    className="absolute top-0 left-0 h-1 w-full"
                    style={{
                        background: `linear-gradient(90deg, hsl(${props.color}), hsl(${props.color} / 0.3))`,
                    }}
                />

                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {props.title}
                    </CardTitle>

                    {Icon && (
                        <motion.div
                            whileHover={{ rotate: 20, scale: 1.2 }}
                            className="rounded-lg p-2"
                            style={{ backgroundColor: `hsl(${props.color} / 0.1)` }}
                        >
                            <Icon className="h-4 w-4" style={{ color: `hsl(${props.color})` }} />
                        </motion.div>
                    )}
                </CardHeader>

                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        <AnimatedNumber value={props.value || 0} />
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="font-medium text-success">+5.10%</span>
                        <span className="text-muted-foreground">vs last month</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
