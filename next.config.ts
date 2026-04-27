import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "media-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const longTermAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/video-increase-traffic-poster.jpg",
        headers: longTermAssetHeaders,
      },
      {
        source: "/video-increase-traffic.optimized.mp4",
        headers: longTermAssetHeaders,
      },
      {
        source: "/video-increase-traffic.optimized.webm",
        headers: longTermAssetHeaders,
      },
      {
        source: "/icon.svg",
        headers: longTermAssetHeaders,
      },
      {
        source: "/gsc-logo.transparent.png",
        headers: longTermAssetHeaders,
      },
      {
        source: "/screaming-frog-logo.transparent.png",
        headers: longTermAssetHeaders,
      },
      {
        source: "/ahrefs_logo.png",
        headers: longTermAssetHeaders,
      },
    ];
  },
};

export default nextConfig;
