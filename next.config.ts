import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/tools/breathing",       destination: "/breathing", permanent: false },
      { source: "/tools/focus-timer",     destination: "/focus",     permanent: false },
      { source: "/tools/sleep-wind-down", destination: "/sleep",     permanent: false },
      { source: "/tools/thought-reframer",destination: "/reframe",   permanent: false },
      { source: "/tools/mood-tracker",    destination: "/mood",      permanent: false },
      { source: "/tools/gratitude-log",   destination: "/gratitude", permanent: false },
    ];
  },
};

export default nextConfig;
