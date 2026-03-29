"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = "light"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-gray-100 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-3xl group-[.toaster]:font-bold",
          description: "group-[.toast]:text-gray-500",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:bg-[#ECFDF5] group-[.toast]:border-[#10B981]/20 group-[.toast]:text-[#065F46] group-[.toast]:shadow-emerald-500/10",
          error: "group-[.toast]:bg-[#FEF2F2] group-[.toast]:border-[#ED1C24]/20 group-[.toast]:text-[#ED1C24] group-[.toast]:shadow-red-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
