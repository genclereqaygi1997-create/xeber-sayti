/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      // Vercel Blob-a yüklənən şəkillər bu domendə saxlanılır — admin
      // paneldəki "Kompüterdən şəkil seç" funksiyasının işləməsi üçün vacibdir.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
