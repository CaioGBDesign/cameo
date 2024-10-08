/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "image.tmdb.org",
      "via.placeholder.com",
      "firebasestorage.googleapis.com",
    ], // Adicione esta linha
  },
};

export default nextConfig;
