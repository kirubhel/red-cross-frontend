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
          success: "group-[.toast]:border-emerald-500 group-[.toast]:bg-emerald-50 group-[.toast]:text-emerald-900",
          error: "group-[.toast]:border-[#ED1C24] group-[.toast]:bg-red-50 group-[.toast]:text-[#ED1C24]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
