import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow subdomain-based routing
  async rewrites() {
    return []
  },
}

export default nextConfig
