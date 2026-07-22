import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AwesomeLM - Power Your Point',
    short_name: 'AwesomeLM',
    description: 'Transform brilliant thoughts into brilliant slides instantly with curated presentation prompts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
