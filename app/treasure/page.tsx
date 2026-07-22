import type { Metadata } from "next"
import { TreasureClientShell } from "@/components/treasure/treasure-client-shell"

export const metadata: Metadata = {
  title: "Treasure Gallery - Presentation Prompts & Visual Templates",
  description:
    "Explore curated NotebookLM and PowerPoint presentation prompts, visual slide templates, and AI design instructions to transform ideas into slides instantly.",
  openGraph: {
    title: "Treasure Gallery - Presentation Prompts | AwesomeLM",
    description:
      "Explore curated NotebookLM and PowerPoint presentation prompts, visual slide templates, and AI design instructions.",
  },
}

export default function TreasurePage() {
  return <TreasureClientShell />
}
