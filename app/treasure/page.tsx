"use client"

import { useState } from "react"
import TimeMachine from "@/components/treasure/time-machine"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { Github, ExternalLink } from "lucide-react"

export default function TreasurePage() {
  const [simpleMode, setSimpleMode] = useState(false)
  const [showPopover, setShowPopover] = useState(false)

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

      {/* GitHub Link with Popover */}
      <div className="absolute bottom-16 sm:bottom-4 left-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowPopover(!showPopover)}
            className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110"
          >
            <Github className="w-6 h-6 text-white" />
          </button>

          {/* Popover */}
          {showPopover && (
            <>
              {/* Backdrop to close popover */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowPopover(false)}
              />
              
              <div 
                className="absolute bottom-full left-0 mb-2 w-80 bg-neutral-900 text-white rounded-lg shadow-xl border border-neutral-700 z-50"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    AwesomeLM Open Source
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Skill Option */}
                    <a
                      href="https://github.com/NabilThange/AwesomeLM-Skill"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-neutral-800 hover:bg-neutral-750 rounded-lg transition-colors group"
                      onClick={() => setShowPopover(false)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            Skill
                            <ExternalLink className="w-3 h-3" />
                          </h4>
                          <p className="text-sm text-neutral-400 mt-1">
                            AI agent skill for generating prompts from screenshots
                          </p>
                        </div>
                      </div>
                    </a>

                    {/* Chrome Extension Option */}
                    <a
                      href="https://github.com/NabilThange/AwesomeLM-Extension"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-neutral-800 hover:bg-neutral-750 rounded-lg transition-colors group"
                      onClick={() => setShowPopover(false)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            Chrome Extension
                            <ExternalLink className="w-3 h-3" />
                          </h4>
                          <p className="text-sm text-neutral-400 mt-1">
                            NotebookLM assistant with curated prompt templates
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                
                {/* Arrow pointer */}
                <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700"></div>
              </div>
            </>
          )}
        </div>
      </div>

      <TimeMachine simpleMode={simpleMode} />
    </main>
  )
}
