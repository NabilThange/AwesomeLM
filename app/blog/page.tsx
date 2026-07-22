import type { Metadata } from "next"
import Link from "next/link"
import { BLOG_POSTS } from "@/lib/blog-data"
import { Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog & Guides - Presentation Prompts, NotebookLM & AI Design",
  description:
    "Deep technical guides on generating presentation slides with Google NotebookLM, prompt engineering for PowerPoint, and modern presentation design.",
  openGraph: {
    title: "AwesomeLM Blog & Guides",
    description:
      "Deep technical guides on generating presentation slides with Google NotebookLM, prompt engineering for PowerPoint, and modern presentation design.",
  },
}

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-black text-white py-12 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-400 bg-blue-950/40 border border-blue-800/40 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            <span>AwesomeLM Knowledge Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif italic text-white tracking-tight">
            Blog & Technical Guides
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Practical strategies on Google NotebookLM visual prompting, PowerPoint engineering, and building high-impact presentations without starting from blank slides.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] shadow-lg group"
            >
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-neutral-300 bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    <a
                      href={post.authorLink}
                      target="_blank"
                      rel="noopener me"
                      className="hover:text-white underline underline-offset-2"
                    >
                      {post.authorName}
                    </a>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {post.readTime}
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 font-medium text-blue-400 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Post</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
