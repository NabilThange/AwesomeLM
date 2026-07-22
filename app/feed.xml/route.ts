import { BLOG_POSTS } from "@/lib/blog-data"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://awesomelm.app"

  const itemsXml = BLOG_POSTS.map(
    (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author><![CDATA[${post.authorName}]]></author>
    </item>`
  ).join("")

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AwesomeLM Blog &amp; Guides</title>
    <link>${baseUrl}/blog</link>
    <description>Deep technical guides on generating presentation slides with Google NotebookLM, AI prompt engineering, and PowerPoint design.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000, stale-while-revalidate=86400",
    },
  })
}
