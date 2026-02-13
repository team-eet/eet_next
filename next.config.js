// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   productionBrowserSourceMaps: true,
// };
//
// module.exports = nextConfig
/** @type {import('next').NextConfig} */

//    "build": "next build && next-build-id"

// console.log(generateBuildId)
const nextConfig = {
  // reactStrictMode: true,
  productionBrowserSourceMaps: true,
  output:"standalone",
  images: {
    domains: ["eetstorage01.blob.core.windows.net", "firebasestorage.googleapis.com"],
  },
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
};

module.exports = nextConfig
