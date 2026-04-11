"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageDetailPopoverProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  title: string
  description: string
}

export function ImageDetailPopover({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
}: ImageDetailPopoverProps) {
  const [copiedDescription, setCopiedDescription] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(description)
      setCopiedDescription(true)
      setTimeout(() => setCopiedDescription(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(description)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when popover is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popover Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image Section */}
            <div className="relative w-full aspect-video bg-black flex-shrink-0">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Content Section - Scrollable */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="p-6 flex flex-col gap-4 overflow-y-auto flex-1 min-h-0"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>

              <div className="flex items-start gap-3">
                <p className="text-gray-700 dark:text-gray-300 flex-1 text-sm leading-relaxed">
                  {description}
                </p>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleCopyDescription}
                  className="flex-shrink-0"
                  title="Copy description"
                >
                  {copiedDescription ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>

              {/* Prompt Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Prompt
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPrompt}
                    className="h-7 gap-1.5"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="text-xs">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <textarea
                  readOnly
                  value={description}
                  className="w-full min-h-[100px] p-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
