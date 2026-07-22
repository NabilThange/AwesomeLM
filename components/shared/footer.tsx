import Link from "next/link"
import { ExternalLink, Github, Globe, BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-md text-white/70 py-8 px-6 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 font-serif text-lg font-medium text-white">
            <span>AwesomeLM.✦</span>
          </div>
          <p className="text-xs text-white/50 max-w-md">
            Transforming brilliant thoughts into brilliant slides instantly. Curated prompts that power your presentations.
          </p>
        </div>

        {/* Backlinks Section */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>AwesomeLM Blog</span>
          </Link>

          <a
            href="https://nabil-thange.vercel.app/"
            target="_blank"
            rel="noopener me"
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
          >
            <Globe className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Nabil Thange Portfolio</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href="https://nabil-thange.vercel.app/blog"
            target="_blank"
            rel="noopener me"
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
          >
            <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Developer Blog</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href="https://github.com/NabilThange/AwesomeLM-Skill"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
          >
            <Github className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        <div className="text-xs text-white/40 text-center md:text-right">
          © {new Date().getFullYear()} AwesomeLM. Built by{" "}
          <a
            href="https://nabil-thange.vercel.app/"
            target="_blank"
            rel="noopener me"
            className="text-white/70 hover:text-white underline underline-offset-2"
          >
            Nabil Thange
          </a>
        </div>
      </div>
    </footer>
  )
}
