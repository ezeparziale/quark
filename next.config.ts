import type { NextConfig } from "next"

import "./src/env"

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
