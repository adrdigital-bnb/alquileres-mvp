/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com', // Para tus datos de prueba actuales
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Para tus futuras fotos reales
      },
    ],
  },
};

export default nextConfig;