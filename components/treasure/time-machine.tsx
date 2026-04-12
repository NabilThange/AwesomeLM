"use client"

import React from "react"
import { motion } from "framer-motion"
import { useShortcuts, clamp } from "@/hooks/use-shortcut"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ClickableCard } from "@/components/treasure/clickable-card"
import { ImageDetailPopover } from "@/components/treasure/image-detail-popover"
import { ImageData } from "@/types/treasure"
import { fetchTreasures } from "@/lib/supabase-queries"

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
  const isMobile = useIsMobile()

  // Mobile: Vertical Carousel (single card view) - swipeable
  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black p-4">
        <Carousel
          orientation="vertical"
          className="w-full max-w-md"
          opts={{
            align: "center",
            loop: true,
            skipSnaps: false,
            dragFree: false,
          }}
        >
          <CarouselContent style={{ height: "70vh" }}>
            {images.map((image, index) => (
              <CarouselItem key={index} style={{ height: "70vh" }}>
                <div className="h-full w-full flex flex-col items-center justify-center gap-4 px-4">
                  <ClickableCard
                    onClick={() => onImageClick(index)}
                    className="relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl cursor-pointer flex-shrink-0"
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="object-cover w-full h-full"
                      draggable={false}
                    />
                  </ClickableCard>
                  <div className="text-center space-y-2 max-w-full">
                    <h3 className="text-white text-lg font-semibold">{image.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{image.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white z-10" />
          <CarouselNext className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white z-10" />
        </Carousel>
      </div>
    )
  }

  // Desktop: Grid Layout
  return (
    <div className="w-full h-full overflow-y-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {images.map((image, index) => (
          <ClickableCard
            key={index}
            onClick={() => onImageClick(index)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-3 cursor-pointer"
            >
              <div className="relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-white text-base font-semibold">{image.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{image.description}</p>
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
}: {
  shouldImplementPreloading?: boolean
  simpleMode?: boolean
}) {
  // Use continuous index that can go infinite in both directions
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [images, setImages] = React.useState<ImageData[]>([])
  const [loading, setLoading] = React.useState(true)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollAccumulator = React.useRef(0)
  const lastUpdateTime = React.useRef(Date.now())
  const touchStartY = React.useRef(0)

  // Popover state
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  // Load treasures from Supabase
  React.useEffect(() => {
    async function loadTreasures() {
      try {
        const data = await fetchTreasures()
        setImages(data)
      } catch (error) {
        console.error('Failed to load treasures:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTreasures()
  }, [])

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

  // Simple Mode rendering
  if (simpleMode) {
    return (
      <>
        <SimpleMode images={images} onImageClick={handleImageClick} />
        {selectedImageIndex !== null && (
          <ImageDetailPopover
            isOpen={isPopoverOpen}
            onClose={handleClosePopover}
            images={[
              images[selectedImageIndex].url,
              ...images[selectedImageIndex].additionalImages
            ]}
            title={images[selectedImageIndex].title}
            description={images[selectedImageIndex].description}
            prompt={images[selectedImageIndex].prompt}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {visibleCards.map((card) => {
            const offsetIndex = card.index - currentIndex
            const blur = currentIndex > card.index ? 2 : 0
            const opacity = currentIndex > card.index ? 0 : 1
            const scale = clamp(1 - offsetIndex * 0.08, [0.08, 2])
            const y = clamp(offsetIndex * FRAME_OFFSET, [FRAME_OFFSET * FRAMES_VISIBLE_LENGTH, Number.POSITIVE_INFINITY])

            const imageData = images[card.imageIndex]
            const image = <img alt={imageData.title} src={imageData.url || "/placeholder.svg"} className="object-cover w-full h-full" />

            return (
              <motion.div
                key={card.index}
                className="absolute w-[85%] max-w-[800px] aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl cursor-pointer"
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
              </motion.div>
            )
          })}
          {visibleCards.map((card) => {
            const offsetIndex = card.index - currentIndex
            if (offsetIndex !== 0) return null
            
            const imageData = images[card.imageIndex]
            
            return (
              <motion.div
                key={`text-${card.index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-20 left-0 right-0 text-center space-y-2 px-4 max-w-2xl mx-auto pointer-events-none"
                style={{ zIndex: 2000 }}
              >
                <h3 className="text-white text-xl font-semibold">{imageData.title}</h3>
                <p className="text-gray-300 text-sm">{imageData.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
      {selectedImageIndex !== null && (
        <ImageDetailPopover
          isOpen={isPopoverOpen}
          onClose={handleClosePopover}
          images={[
            images[selectedImageIndex].url,
            ...images[selectedImageIndex].additionalImages
          ]}
          title={images[selectedImageIndex].title}
          description={images[selectedImageIndex].description}
          prompt={images[selectedImageIndex].prompt}
        />
      )}
    </>
  )
}
