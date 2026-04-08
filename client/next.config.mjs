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
            },
            {
                protocol: 'https',
                hostname: 'yt3.googleusercontent.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**'
            }
        ]
    }
}

export default nextConfig
