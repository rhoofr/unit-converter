import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'unit-converter';

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js Image Optimization
  },
};

export default nextConfig;
