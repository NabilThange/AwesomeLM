import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://awesomelm.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/treasure', '/blog', '/blog/*', '/llms.txt', '/llms-full.txt', '/humans.txt', '/feed.xml'],
        disallow: ['/api/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'AnthropicAI', 'SearchGPT'],
        allow: ['/', '/llms.txt', '/llms-full.txt', '/blog', '/treasure'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
