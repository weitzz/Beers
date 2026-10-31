/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        qualities: [75, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.punkapi.com'
            },
            {
                protocol: 'https',
                hostname: 'punkapi.dev',
                pathname: '/api/v3/images/**'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com'
            }
        ]
    }
}

module.exports = nextConfig
