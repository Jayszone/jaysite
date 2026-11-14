/** @type {import('next').NextConfig} */
const exporting = !!process.env.EXPORT; // static export, used for the hosted preview (scripts/make-preview.mjs)
const nextConfig = exporting
  ? { reactStrictMode: true, output: "export", trailingSlash: true, images: { unoptimized: true } }
  : { reactStrictMode: true, async redirects() { return [{ source: "/work", destination: "/", permanent: false }]; } };
export default nextConfig;
