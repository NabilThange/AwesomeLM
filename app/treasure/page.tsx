"use client"

import { useState } from "react"
import TimeMachine from "@/components/treasure/time-machine"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { Github, Copy, Check } from "lucide-react"

export default function TreasurePage() {
  const [simpleMode, setSimpleMode] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npx skills add NabilThange/notebooklm-prompts")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <main className="w-full h-screen bg-black relative" data-route="treasure">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <span className="text-white text-sm font-medium">
          {simpleMode ? "Simple" : "Normal"}
        </span>
        <ToggleSwitch
          checked={simpleMode}
          onChange={setSimpleMode}
        />
      </div>

      {/* GitHub Link with Tooltip */}
      <div className="absolute bottom-4 left-4 z-50">
        <div className="relative">
          <a
            href="https://github.com/NabilThange/notebooklm-prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Github className="w-6 h-6 text-white" />
          </a>

          {/* Tooltip */}
          {showTooltip && (
            <div 
              className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-neutral-900 text-white text-sm rounded-lg shadow-xl border border-neutral-700"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <p className="font-medium mb-1">Install skill to use this</p>
              <p className="text-neutral-300 text-xs mb-2">
                Give your agent any screenshot and it will generate a prompt for it
              </p>
              <div className="mt-2 pt-2 border-t border-neutral-700">
                <p className="text-neutral-400 text-xs mb-1">To install, run:</p>
                <div className="relative group">
                  <code className="block bg-neutral-800 text-neutral-200 px-2 py-1 rounded text-xs font-mono pr-8">
                    npx skills add NabilThange/notebooklm-prompts
                  </code>
                  <button
                    onClick={handleCopy}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-700 rounded transition-colors"
                    title="Copy command"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-400 hover:text-white" />
                    )}
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700"></div>
            </div>
          )}
        </div>
      </div>

      <TimeMachine simpleMode={simpleMode} />
    </main>
  )
}
