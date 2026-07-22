"use client"

import React from "react"
import { motion } from "framer-motion"
import { useShortcuts, clamp } from "@/hooks/use-shortcut"
import { useIsMobile } from "@/hooks/use-mobile"
import { ClickableCard } from "@/components/treasure/clickable-card"
import { ImageDetailPopover } from "@/components/treasure/image-detail-popover"
import { SubmitPromptModal } from "@/components/treasure/submit-prompt-modal"
import { ImageData } from "@/types/treasure"
import { fetchTreasures } from "@/lib/supabase-queries"
import { useImagePreload } from "@/hooks/use-image-preload"

const FRAME_OFFSET = -30
const FRAMES_VISIBLE_LENGTH = 3
const SCROLL_THRESHOLD = 40
const BUFFER_SIZE = 8 // Render 8 cards before and after visible range (increased for fast scrolling)

// Simple Mode Component
function SimpleMode({ 
  images, 
  onImageClick 
}: { 
  images: ImageData[]
  onImageClick: (index: number) => void
}) {
  return (
    <div className="w-full h-full overflow-y-auto pt-12 md:pt-16 px-4 md:px-8 pb-20 md:pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
        {images.map((image, index) => (
          <ClickableCard
            key={index}
            onClick={() => onImageClick(index)}
            className="h-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.4) }}
              className="flex flex-col h-full bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[16/9] bg-black/40 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={image.url || "/404.png"}
                  alt={image.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content Group (Title + Description + Author) */}
              <div className="mt-3 flex flex-col gap-1 flex-1 justify-start">
                <h3 className="text-white text-base font-semibold line-clamp-2 group-hover:text-zinc-100 transition-colors">
                  {image.title}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                  {image.description}
                </p>
                <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                  <span>
                    By{" "}
                    {image.author_link ? (
                      <a
                        href={image.author_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-300 font-medium hover:text-white underline inline-flex items-center gap-0.5"
                      >
                        {image.author_name || "Nabil"}
                      </a>
                    ) : (
                      <strong className="text-zinc-300 font-medium">{image.author_name || "Nabil"}</strong>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </ClickableCard>
        ))}
      </div>
    </div>
  )
}

export default function TimeMachine({
  shouldImplementPreloading = false,
  simpleMode = false,
  isSubmitOpen = false,
  onCloseSubmit,
}: {
  shouldImplementPreloading?: boolean
  simpleMode?: boolean
  isSubmitOpen?: boolean
  onCloseSubmit?: () => void
}) {
  // Use continuous index that can go infinite in both directions
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [images, setImages] = React.useState<ImageData[]>([])
  const [loading, setLoading] = React.useState(true)
  const isMobile = useIsMobile()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollAccumulator = React.useRef(0)
  const lastUpdateTime = React.useRef(Date.now())
  const touchStartY = React.useRef(0)

  // Popover state
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  // Load treasures from Supabase
  const loadTreasures = React.useCallback(async () => {
    try {
      const data = await fetchTreasures()
      setImages(data)
    } catch (error) {
      console.error('Failed to load treasures:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadTreasures()
  }, [loadTreasures])

  // Preload first 8 images for faster initial display
  useImagePreload(images, {
    count: 8,
    preset: 'medium',
    enabled: !loading && images.length > 0
  })

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsPopoverOpen(true)
  }

  const handleClosePopover = () => {
    setIsPopoverOpen(false)
  }

  // Calculate which cards should be rendered (visible + buffer)
  const getVisibleCards = React.useCallback(() => {
    const start = currentIndex - BUFFER_SIZE
    const end = currentIndex + FRAMES_VISIBLE_LENGTH + BUFFER_SIZE
    const cards = []

    for (let i = start; i <= end; i++) {
      cards.push({
        index: i,
        imageIndex: ((i % images.length) + images.length) % images.length, // Positive modulo
      })
    }

    return cards
  }, [currentIndex, images.length])

  React.useEffect(() => {
    // Don't attach event listeners in simple mode
    if (simpleMode) return

    const container = containerRef.current
    if (!container) return

    const MIN_UPDATE_INTERVAL = 75 // Minimum 75ms between index changes (max ~13 changes per second)

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      scrollAccumulator.current += e.deltaY

      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime.current

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        // Only update if enough time has passed since last update
        if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
          const delta = scrollAccumulator.current > 0 ? 1 : -1
          setCurrentIndex((prev) => prev + delta)
          scrollAccumulator.current = 0
          lastUpdateTime.current = now
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY.current - touchY
      touchStartY.current = touchY

      scrollAccumulator.current += deltaY

      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime.current

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
          const delta = scrollAccumulator.current > 0 ? 1 : -1
          setCurrentIndex((prev) => prev + delta)
          scrollAccumulator.current = 0
          lastUpdateTime.current = now
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    })
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    })

    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
    }
  }, [simpleMode, images.length]) // Added images.length to ensure it runs after data loads

  useShortcuts({
    ArrowRight: () => {
      setCurrentIndex((prev) => prev + 1)
    },
    ArrowLeft: () => {
      setCurrentIndex((prev) => prev - 1)
    },
  })

  const visibleCards = getVisibleCards()

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">Loading treasures...</div>
      </div>
    )
  }

  // Show empty state
  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">No treasures found</div>
      </div>
    )
  }

  const handleModalClose = () => {
    if (onCloseSubmit) onCloseSubmit()
  }

  const handleModalSuccess = () => {
    loadTreasures()
  }

  const activeSelected = selectedImageIndex !== null ? images[selectedImageIndex] : null

  return (
    <>
      {simpleMode ? (
        <SimpleMode images={images} onImageClick={handleImageClick} />
      ) : (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {visibleCards.map((card) => {
              const offsetIndex = card.index - currentIndex
              const blur = currentIndex > card.index ? 2 : 0
              const opacity = currentIndex > card.index ? 0 : 1
              const frameOffset = isMobile ? -15 : FRAME_OFFSET
              const scaleMultiplier = isMobile ? 0.04 : 0.08
              const scale = clamp(1 - offsetIndex * scaleMultiplier, [0.08, 2])
              const y = clamp(offsetIndex * frameOffset, [frameOffset * FRAMES_VISIBLE_LENGTH, Number.POSITIVE_INFINITY])

              const imageData = images[card.imageIndex]
              const image = <img alt={imageData.title} src={imageData.url || "/placeholder.svg"} className="object-cover w-full h-full" />

              return (
                <motion.div
                  key={card.index}
                  className="absolute w-[95%] md:w-[85%] max-w-[800px] aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl cursor-pointer"
                  initial={false}
                  animate={{
                    y,
                    scale,
                    transition: {
                      type: "spring",
                      stiffness: 250,
                      damping: 20,
                      mass: 0.5,
                    },
                  }}
                  style={{
                    willChange: "opacity, filter, transform",
                    filter: `blur(${blur}px)`,
                    opacity,
                    transitionProperty: "opacity, filter",
                    transitionDuration: "200ms",
                    transitionTimingFunction: "ease-in-out",
                    zIndex: 1000 - card.index,
                    pointerEvents: offsetIndex === 0 ? "auto" : "none",
                  }}
                  onClick={() => handleImageClick(card.imageIndex)}
                >
                  {shouldImplementPreloading ? <>{offsetIndex < FRAMES_VISIBLE_LENGTH ? image : null}</> : image}
                  {/* Text overlay - only show on front card */}
                  {offsetIndex === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pb-6 md:pb-8 text-center pointer-events-none">
                      <h3 className="text-white text-base md:text-xl font-semibold mb-1 md:mb-2">{imageData.title}</h3>
                      <p className="text-gray-300 text-xs md:text-sm line-clamp-2">{imageData.description}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {activeSelected && (
        <ImageDetailPopover
          isOpen={isPopoverOpen}
          onClose={handleClosePopover}
          images={[
            activeSelected.url,
            ...activeSelected.additionalImages
          ]}
          id={activeSelected.id}
          title={activeSelected.title}
          description={activeSelected.description}
          prompt={activeSelected.prompt}
          author_name={activeSelected.author_name}
          author_link={activeSelected.author_link}
        />
      )}

      {/* Submit Prompt Modal */}
      <SubmitPromptModal
        isOpen={isSubmitOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}
