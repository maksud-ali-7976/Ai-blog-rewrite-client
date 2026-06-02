"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      closeButton
      expand
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-purple-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl",
          title: "text-white font-medium",
          description: "text-white/70",
          actionButton:
            "bg-white/20 hover:bg-white/30 text-white border-none",
          cancelButton:
            "bg-white/10 hover:bg-white/20 text-white border-none",
        },
      }}
      style={
        {
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }