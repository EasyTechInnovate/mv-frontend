/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '/**'
            }
        ]
    }
}

export default nextConfig
