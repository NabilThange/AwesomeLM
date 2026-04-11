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

interface ImageData {
  url: string
  description: string
  title: string
}

const IMAGES: ImageData[] = [
  {
    url: "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg",
    description: "A stunning sunset over mountain peaks with golden hour lighting illuminating the landscape",
    title: "Mountain Sunset"
  },
  {
    url: "https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg",
    description: "Serene lake reflection capturing the beauty of nature in perfect symmetry",
    title: "Lake Reflection"
  },
  {
    url: "https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg",
    description: "Vibrant autumn forest with colorful foliage creating a natural tapestry",
    title: "Autumn Forest"
  },
  {
    url: "https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg",
    description: "Majestic waterfall cascading down rocky cliffs surrounded by lush greenery",
    title: "Waterfall Vista"
  },
  {
    url: "https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg",
    description: "Peaceful beach scene with crystal clear waters and pristine white sand",
    title: "Beach Paradise"
  },
  {
    url: "https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg",
    description: "Dramatic mountain range with snow-capped peaks reaching into the clouds",
    title: "Alpine Heights"
  },
  {
    url: "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg",
    description: "A stunning sunset over mountain peaks with golden hour lighting illuminating the landscape",
    title: "Mountain Sunset"
  },
]

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
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollAccumulator = React.useRef(0)
  const lastUpdateTime = React.useRef(Date.now())
  const touchStartY = React.useRef(0)

  // Popover state
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

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
        imageIndex: ((i % IMAGES.length) + IMAGES.length) % IMAGES.length, // Positive modulo
      })
    }

    return cards
  }, [currentIndex])

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
  }, [simpleMode])

  useShortcuts({
    ArrowRight: () => {
      setCurrentIndex((prev) => prev + 1)
    },
    ArrowLeft: () => {
      setCurrentIndex((prev) => prev - 1)
    },
  })

  const visibleCards = getVisibleCards()

  // Simple Mode rendering
  if (simpleMode) {
    return (
      <>
        <SimpleMode images={IMAGES} onImageClick={handleImageClick} />
        {selectedImageIndex !== null && (
          <ImageDetailPopover
            isOpen={isPopoverOpen}
            onClose={handleClosePopover}
            imageUrl={IMAGES[selectedImageIndex].url}
            title={IMAGES[selectedImageIndex].title}
            description={IMAGES[selectedImageIndex].description}
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

            const imageData = IMAGES[card.imageIndex]
            const image = <img alt={imageData.title} src={imageData.url || "/placeholder.svg"} className="object-cover w-full h-full" />

            return (
              <ClickableCard
                key={card.index}
                onClick={() => handleImageClick(card.imageIndex)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-[85%] max-w-[800px] cursor-pointer"
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
                  }}
                >
                  <div className="aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl">
                    {shouldImplementPreloading ? <>{offsetIndex < FRAMES_VISIBLE_LENGTH ? image : null}</> : image}
                  </div>
                  {offsetIndex === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 text-center space-y-2 px-4"
                    >
                      <h3 className="text-white text-xl font-semibold">{imageData.title}</h3>
                      <p className="text-gray-300 text-sm max-w-2xl mx-auto">{imageData.description}</p>
                    </motion.div>
                  )}
                </motion.div>
              </ClickableCard>
            )
          })}
        </div>
      </div>
      {selectedImageIndex !== null && (
        <ImageDetailPopover
          isOpen={isPopoverOpen}
          onClose={handleClosePopover}
          imageUrl={IMAGES[selectedImageIndex].url}
          title={IMAGES[selectedImageIndex].title}
          description={IMAGES[selectedImageIndex].description}
        />
      )}
    </>
  )
}
