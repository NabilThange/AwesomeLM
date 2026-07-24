import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data"
import { renderMarkdownToHtml } from "@/lib/markdown-renderer"
import { getBaseUrl } from "@/lib/utils"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Sparkles,
  FileText,
  Compass,
  Rss,
  Globe,
  BookOpen,
} from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return {}

  const baseUrl = getBaseUrl()

  return {
    title: `${post.title} | AwesomeLM Blog`,
    description: post.description,
    authors: [{ name: post.authorName, url: post.authorLink }],
    openGraph: {
      title: `${post.title} | AwesomeLM`,
      description: post.description,
      type: "article",
      url: `${baseUrl}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.authorLink],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const htmlContent = renderMarkdownToHtml(post.content)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.authorName,
      "url": post.authorLink,
      "sameAs": ["https://nabil-thange.vercel.app/blog"],
    },
    "publisher": {
      "@type": "Organization",
      "name": "AwesomeLM",
      "url": "https://awesomelm.app/",
    },
    "mainEntityOfPage": `https://awesomelm.app/blog/${post.slug}`,
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4 border-b border-neutral-800 pb-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-blue-400 bg-blue-950/40 border border-blue-800/40 px-3 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif italic text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-2">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              By{" "}
              <a
                href={post.authorLink}
                target="_blank"
                rel="noopener me"
                className="text-white hover:underline flex items-center gap-0.5 font-medium"
              >
                {post.authorName}
                <ExternalLink className="w-2.5 h-2.5 inline" />
              </a>
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              {post.date}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div
          className="prose prose-invert max-w-none text-neutral-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-blue-950/50 via-neutral-900 to-purple-950/50 border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Explore Presentation Prompts
            </h3>
            <p className="text-xs text-neutral-400">
              Browse our 100% free presentation prompts in the AwesomeLM Treasury.
            </p>
          </div>
          <Link
            href="/treasure"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
          >
            <span>Open Treasury</span>
            <Compass className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* SEO / GEO / AEO Exploration & Index Links */}
        <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-6 space-y-4 text-xs text-neutral-400">
          <h4 className="font-semibold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Developer & AI Indexes</span>
          </h4>
          <p className="text-neutral-400 text-xs">
            AwesomeLM provides machine-readable endpoints for Search Console indexing and Generative Engine Optimization (GEO/AEO):
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/treasure"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-white bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Prompt Treasury (/treasure)</span>
            </Link>

            <a
              href="/llms.txt"
              target="_blank"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-white bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>LLM Index (/llms.txt)</span>
            </a>

            <a
              href="/llms-full.txt"
              target="_blank"
              className="inline-flex items-center gap-1 text-purple-400 hover:text-white bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full LLM Corpus (/llms-full.txt)</span>
            </a>

            <a
              href="/humans.txt"
              target="_blank"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-white bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Human Credits (/humans.txt)</span>
            </a>

            <a
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-white bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>XML Sitemap (/sitemap.xml)</span>
            </a>

            <a
              href="/feed.xml"
              target="_blank"
              className="inline-flex items-center gap-1 text-orange-400 hover:text-white bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Rss className="w-3.5 h-3.5" />
              <span>RSS Feed (/feed.xml)</span>
            </a>

            <a
              href="https://nabil-thange.vercel.app/"
              target="_blank"
              rel="noopener me"
              className="inline-flex items-center gap-1 text-white hover:text-blue-300 bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Nabil Thange Portfolio</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            <a
              href="https://nabil-thange.vercel.app/blog"
              target="_blank"
              rel="noopener me"
              className="inline-flex items-center gap-1 text-white hover:text-emerald-300 bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Developer Blog</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>
        </div>
      </article>
    </main>
  )
}
