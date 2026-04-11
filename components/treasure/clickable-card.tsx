"use client"

import React, { useRef } from "react"

interface ClickableCardProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
}

export function ClickableCard({ children, onClick, className = "" }: ClickableCardProps) {
  const pointerDownRef = useRef({ x: 0, y: 0, time: 0 })
  const isClickRef = useRef(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    }
    isClickRef.current = true
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isClickRef.current) return

    const dx = Math.abs(e.clientX - pointerDownRef.current.x)
    const dy = Math.abs(e.clientY - pointerDownRef.current.y)
    const dt = Date.now() - pointerDownRef.current.time

    const MOVEMENT_THRESHOLD = 10
    const TIME_THRESHOLD = 300

    // Only trigger click if movement is minimal and duration is short
    if (dx < MOVEMENT_THRESHOLD && dy < MOVEMENT_THRESHOLD && dt < TIME_THRESHOLD) {
      onClick()
    }

    isClickRef.current = false
  }

  const handlePointerCancel = () => {
    isClickRef.current = false
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={className}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {children}
    </div>
  )
}
