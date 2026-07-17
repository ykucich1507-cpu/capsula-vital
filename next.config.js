/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/notas': ['./notas-vault/**/*'],
    },
  },
}

module.exports = nextConfig
