"use client"

import React from 'react'

interface ToggleSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function ToggleSwitch({ 
  checked = false, 
  onChange, 
  disabled = false,
  className = ""
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = React.useState(checked)

  React.useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    setIsChecked(newValue)
    onChange?.(newValue)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only peer"
        id="toggle-switch"
      />
      <label
        htmlFor="toggle-switch"
        className={`
          relative block w-12 h-6 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 292 142"
          className="w-full h-full overflow-visible"
        >
          {/* Background path */}
          <path
            d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z"
            className={`
              transition-all duration-400 ease-in-out
              ${isChecked ? 'fill-neutral-700 dark:fill-neutral-400' : 'fill-neutral-300 dark:fill-neutral-600'}
            `}
          />

          {/* On icon (pause/stop) */}
          <rect
            rx={6}
            height={64}
            width={12}
            y={39}
            x={64}
            className={`
              transition-all duration-400 ease-in-out
              ${isChecked ? 'fill-white dark:fill-neutral-900' : 'fill-neutral-300 dark:fill-neutral-600'}
            `}
          />

          {/* Off icon (circle) */}
          <path
            d="M221 91C232.046 91 241 82.0457 241 71C241 59.9543 232.046 51 221 51C209.954 51 201 59.9543 201 71C201 82.0457 209.954 91 221 91ZM221 103C238.673 103 253 88.6731 253 71C253 53.3269 238.673 39 221 39C203.327 39 189 53.3269 189 71C189 88.6731 203.327 103 221 103Z"
            fillRule="evenodd"
            className={`
              transition-all duration-400 ease-in-out
              ${isChecked ? 'fill-neutral-700 dark:fill-neutral-400' : 'fill-neutral-200 dark:fill-neutral-700'}
            `}
          />

          {/* Goo filter effect */}
          <defs>
            <filter id="goo">
              <feGaussianBlur stdDeviation={10} result="blur" in="SourceGraphic" />
              <feColorMatrix
                result="goo"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                mode="matrix"
                in="blur"
              />
            </filter>
          </defs>

          <g filter="url('#goo')">
            {/* Center circle */}
            <rect
              fill="#fff"
              rx={29}
              height={58}
              width={116}
              y={42}
              x={13}
              className={`
                transition-transform duration-600 ease-in-out origin-center
                ${isChecked ? 'translate-x-[150px]' : 'translate-x-0'}
              `}
            />

            {/* Left circle */}
            <rect
              fill="#fff"
              rx={58}
              height={114}
              width={114}
              y={14}
              x={14}
              className={`
                transition-transform duration-450 ease-in-out origin-center
                ${isChecked ? 'scale-0' : 'scale-100'}
              `}
            />

            {/* Right circle */}
            <rect
              fill="#fff"
              rx={58}
              height={114}
              width={114}
              y={14}
              x={164}
              className={`
                transition-transform duration-450 ease-in-out origin-center
                ${isChecked ? 'scale-100' : 'scale-0'}
              `}
            />
          </g>
        </svg>
      </label>
    </div>
  )
}
