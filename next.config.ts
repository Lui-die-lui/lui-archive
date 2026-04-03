import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Firebase `signInWithPopup` / Google gapi 가 팝업의 window.closed 를 확인할 때,
   * 기본 COOP(same-origin)면 브라우저가 차단해 콘솔에 경고가 난다.
   * OAuth 팝업과 호환되도록 완화(보안은 same-origin 유지, 팝업 참조만 허용).
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
