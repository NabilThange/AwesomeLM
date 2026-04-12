"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageDetailPopoverProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  title: string
  description: string
  prompt?: string
}

export function ImageDetailPopover({
  isOpen,
  onClose,
  images,
  title,
  description,
  prompt,
}: ImageDetailPopoverProps) {
  const [copiedDescription, setCopiedDescription] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
      await navigator.clipboard.writeText(prompt || description)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
      if (e.key === "ArrowLeft" && isOpen && images.length > 1) {
        handlePrevImage()
      }
      if (e.key === "ArrowRight" && isOpen && images.length > 1) {
        handleNextImage()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose, images.length])

  // Prevent body scroll when popover is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setCurrentImageIndex(0) // Reset to first image when opening
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Popover Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 z-[9999] w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[85vh] sm:max-h-[80vh] bg-white dark:bg-neutral-950 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image Section */}
            <div className="relative w-full h-[250px] md:h-[400px] bg-black flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Navigation Arrows - Only show if multiple images */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-6"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Section - Scrollable */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="p-3 sm:p-4 md:p-6 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-y-auto flex-1 min-h-0"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex-1">
                  {title}
                </h2>
                {/* <button
                  className="group flex items-center font-medium text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 text-white bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-2xl tracking-wide transition-all hover:shadow-lg flex-shrink-0"
                  onClick={() => {
                    // TODO: Add launch functionality
                    console.log('Launch clicked for:', title)
                  }}
                >
                  <svg
                    height={20}
                    width={20}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 sm:mr-2 rotate-[30deg] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-1 group-hover:rotate-90"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-1.5 hidden sm:inline">
                    FineTune
                  </span>
                </button> */}
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Prompt
                  </label>
                  <Button
                    variant="ghost"
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
                        <span className="text-xs hidden sm:inline">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <textarea
                  readOnly
                  value={prompt || description}
                  className="w-full min-h-[80px] sm:min-h-[100px] p-3 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500"
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
