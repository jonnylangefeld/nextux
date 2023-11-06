// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withLogtail } = require("@logtail/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
}

module.exports = withLogtail(nextConfig)
