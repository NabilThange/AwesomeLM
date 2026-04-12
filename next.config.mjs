const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qyhtrqobtwmbymviezcs.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },
}

export default nextConfig
