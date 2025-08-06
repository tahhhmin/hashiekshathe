// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com', // For the redirect URL (though better to fix the URL itself)
        port: '',
        pathname: '/url/**', // Allow paths under /url/
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Assuming the actual image is on Wikipedia's upload servers
        port: '',
        pathname: '/wikipedia/commons/**', // Adjust based on common paths for Wikipedia images
      },
      {
        protocol: 'https',
        hostname: 'developers.elementor.com', // You had this in previous data, so include it.
        port: '',
        pathname: '/docs/assets/img/**',
      },
      {
                protocol: 'https',
                hostname: 'drive.google.com',
                port: '', // Optional: you can leave this as an empty string
                pathname: '/file/d/**', // This is a good pattern for Google Drive files
            },

            {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      // Add any other domains where your actual image thumbnails will be hosted
      // For example, if you host on Cloudinary or Imgur:
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'i.imgur.com',
      // },
    ],
  },
};

module.exports = nextConfig;