"use client"

import { useState } from "react"
import TimeMachine from "@/components/treasure/time-machine"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function TreasurePage() {
  const [simpleMode, setSimpleMode] = useState(false)

  return (
    <main className="w-full h-screen bg-black relative" data-route="treasure">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
        <Label htmlFor="simple-mode" className="text-white text-sm cursor-pointer">
          Simple Mode
        </Label>
        <Switch
          id="simple-mode"
          checked={simpleMode}
          onCheckedChange={setSimpleMode}
        />
      </div>
      <TimeMachine simpleMode={simpleMode} />
    </main>
  )
}
