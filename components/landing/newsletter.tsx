"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useIsV0 } from "@/lib/context";

const DURATION = 0.3;
const DELAY = DURATION;
const EASE_OUT = "easeOut";
const EASE_OUT_OPACITY = [0.25, 0.46, 0.45, 0.94] as const;
const SPRING = {
  type: "spring" as const,
  stiffness: 60,
  damping: 10,
  mass: 0.8,
};

export const Newsletter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isInitialRender = useRef(true);

  useEffect(() => {
    return () => {
      isInitialRender.current = false;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full short:lg:pt-10 pb-footer-safe-area 2xl:pt-footer-safe-area px-sides short:lg:gap-4 lg:gap-8">
      <motion.div
        layout="position"
        transition={{ duration: DURATION, ease: EASE_OUT }}
      >
        <h1 className="font-serif text-5xl italic short:lg:text-8xl sm:text-8xl lg:text-9xl text-foreground">
          AwesomeLM.✦ ݁˖
        </h1>
      </motion.div>

      <div className="flex flex-col items-center min-h-0 shrink">
        <AnimatePresenceGuard>
          {!isOpen && (
            <motion.div
              key="description"
              initial={isInitialRender.current ? false : "hidden"}
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  scale: 1,
                  transition: {
                    delay: DELAY,
                    duration: DURATION,
                    ease: EASE_OUT,
                  },
                },
                hidden: {
                  scale: 0.9,
                  transition: { duration: DURATION, ease: EASE_OUT },
                },
                exit: {
                  y: -150,
                  scale: 0.9,
                  transition: { duration: DURATION, ease: EASE_OUT },
                },
              }}
            >
              <div className="flex flex-col gap-4 w-full max-w-xl md:gap-6 lg:gap-8">
                <motion.p
                  initial={isInitialRender.current ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: DURATION, ease: EASE_OUT_OPACITY },
                  }}
                  transition={{
                    duration: DURATION,
                    ease: EASE_OUT,
                    delay: DELAY,
                  }}
                  className="text-base short:lg:text-lg sm:text-lg lg:text-xl !leading-[1.1] font-medium text-center text-foreground text-pretty"
                >
                  Professional visuals, zero friction. Dive into our collection of high-impact prompts and go from a blank page to a finished deck in half the time.
                </motion.p>
              </div>
            </motion.div>
          )}

          <motion.div
            layout="position"
            transition={SPRING}
            key="treasure-button"
            className={isOpen ? "my-6" : "mt-6"}
          >
            <Button
              className={cn("relative px-8")}
              onClick={() => router.push('/treasure')}
              shine={true}
            >
              <span className="inline-block">
                Treasure
              </span>
            </Button>
          </motion.div>

          {isOpen && (
            <motion.div
              key="manifesto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: DELAY,
                    duration: DURATION,
                    ease: EASE_OUT,
                  },
                },
                hidden: {
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: DURATION, ease: EASE_OUT },
                },
                exit: {
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: DURATION, ease: EASE_OUT_OPACITY },
                },
              }}
              className="relative flex min-h-0 flex-shrink overflow-hidden text-sm md:text-base max-h-[calc(70dvh-var(--footer-safe-area))] flex-col gap-8 text-center backdrop-blur-xl text-balance border-2 border-border/50 bg-primary/20 max-w-3xl text-foreground rounded-3xl ring-1 ring-offset-primary/10 ring-border/10 ring-offset-2 shadow-button"
            >
              <article className="relative overflow-y-auto italic p-6 h-full [&_p]:my-4">
                <h2 className="text-2xl font-bold not-italic mb-6">The AwesomeLM Manifesto</h2>
                <p>
                  Ideas die on blank slides.
                </p>
                <p>
                  The world doesn&apos;t need another hour-long presentation stuffed with endless bullet points. It needs clarity. It needs impact. But somewhere along the line, we decided that creating beautiful, compelling visuals required a design degree or hours of agonizing pixel-pushing.
                </p>
                <p>
                  We call BS.
                </p>
                <p>
                  Your ideas are already good; they just need the right spark. We built AwesomeLM because we believe the distance between a brilliant thought and a brilliant slide should be zero.
                </p>
                <p>
                  We don&apos;t do templates. Templates box you in. We do prompts—the raw material, the architectural blueprints, the exact instructions you need to generate visuals that actually say something.
                </p>
                <p>
                  We curate the starting lines. You bring the vision.
                </p>
                <p>
                  Stop staring at a white screen. Stop settling for default formatting. Skip the blank slide.
                </p>
                <p className="text-xl font-bold not-italic mt-6">
                  Power Your Point.
                </p>
              </article>
            </motion.div>
          )}
        </AnimatePresenceGuard>
      </div>

      {/* Manifesto button at bottom */}
      <div className="absolute bottom-[calc(var(--inset)+0.8rem)] md:bottom-[calc(var(--inset)+1.5rem)] left-1/2 -translate-x-1/2">
        <Button
          className={cn("relative px-8")}
          onClick={() => setIsOpen(!isOpen)}
          shine={!isOpen}
        >
          <motion.span
            animate={{ x: isOpen ? -16 : 0 }}
            transition={{ duration: DURATION, ease: EASE_OUT }}
            className="inline-block"
          >
            Manifesto
          </motion.span>

          {isOpen && (
            <motion.div
              className={cn(
                buttonVariants({ variant: "iconButton", size: "icon" }),
                "absolute -top-px -right-px aspect-square"
              )}
              initial={{ opacity: 0, scale: 0.8, rotate: -40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: DURATION,
                ease: EASE_OUT,
                delay: DELAY,
              }}
            >
              <Cross1Icon className="size-5 text-primary-foreground" />
            </motion.div>
          )}
        </Button>
      </div>
    </div>
  );
};

const AnimatePresenceGuard = ({ children }: { children: React.ReactNode }) => {
  const isV0 = useIsV0();

  return isV0 ? <>{children}</> : <AnimatePresence mode="popLayout" propagate>{children}</AnimatePresence>;
};
