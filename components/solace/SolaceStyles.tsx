"use client";

export default function SolaceStyles() {
  return (
    <style jsx global>{`
      :root {
        --background: #f8f9ff;
        --foreground: #18212f;
        --muted: #5f6b7a;
        --radius-xl: 28px;
        --radius-lg: 22px;
        --radius-md: 18px;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        color: var(--foreground);
        font-family: Arial, Helvetica, sans-serif;
        background:
          radial-gradient(circle at 20% 0%, rgba(175, 185, 255, 0.35), transparent 30%),
          radial-gradient(circle at 80% 10%, rgba(210, 195, 255, 0.28), transparent 30%),
          radial-gradient(circle at 50% 100%, rgba(220, 235, 255, 0.35), transparent 35%),
          linear-gradient(180deg, #f7f9ff 0%, #eef2ff 50%, #f9f7ff 100%);
        background-attachment: fixed;
        min-height: 100vh;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .solace-shell {
        position: relative;
        min-height: 100vh;
      }

      .solace-page {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
      }

      .solace-section {
        padding: 48px 0;
      }

      .solace-title {
        font-size: clamp(2.4rem, 4vw, 4.2rem);
        line-height: 1.05;
        letter-spacing: -0.04em;
        font-weight: 600;
        margin: 0;
      }

      .solace-h2 {
        font-size: clamp(1.6rem, 2vw, 2.5rem);
        line-height: 1.1;
        letter-spacing: -0.03em;
        font-weight: 600;
        margin: 0;
      }

      .solace-h3 {
        font-size: clamp(1.1rem, 1.4vw, 1.35rem);
        line-height: 1.2;
        letter-spacing: -0.02em;
        font-weight: 600;
        margin: 0;
      }

      .solace-body {
        font-size: 1rem;
        line-height: 1.75;
        color: var(--muted);
      }

      .solace-body-xl {
        font-size: clamp(1.05rem, 1.4vw, 1.2rem);
        line-height: 1.75;
        color: var(--muted);
      }

      .solace-label {
        font-size: 0.88rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #6a7691;
      }

      .solace-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: fit-content;
        max-width: fit-content;
        justify-self: start;
        padding: 10px 16px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.94);
        box-shadow:
          0 10px 30px rgba(60, 70, 120, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #4a5568;
      }

      .solace-grid {
        display: grid;
        gap: 24px;
      }

      .solace-surface-card {
        border-radius: var(--radius-xl);
        border: 1px solid rgba(255, 255, 255, 0.65);
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        box-shadow:
          0 20px 60px rgba(50, 60, 110, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        transition: all 0.22s ease;
      }

      .solace-surface-card:hover {
        transform: translateY(-4px);
        box-shadow:
          0 26px 70px rgba(50, 60, 110, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.85);
      }

      .solace-card {
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.55);
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border-radius: var(--radius-xl);
        box-shadow: 0 20px 60px rgba(44, 53, 87, 0.08);
      }

      .solace-card-inner {
        position: relative;
        border-radius: inherit;
        overflow: hidden;
      }

      .solace-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 0 8px;
      }

      .solace-nav-links {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .solace-nav-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 18px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.95);
        box-shadow:
          0 12px 32px rgba(50, 60, 110, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #3f4a5f;
        transition: all 0.18s ease;
      }

      .solace-nav-link:hover {
        transform: translateY(-1px);
        background: rgba(255, 255, 255, 0.98);
        box-shadow:
          0 16px 40px rgba(50, 60, 110, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.96);
      }

      .solace-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        appearance: none;
        border: none;
        border-radius: 999px;
        padding: 15px 26px;
        font-size: 0.96rem;
        line-height: 1;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: white;
        cursor: pointer;
        background: linear-gradient(135deg, #7d8dff 0%, #a197ff 100%);
        box-shadow: 0 10px 26px rgba(125, 141, 255, 0.26);
        transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
      }

      .solace-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 30px rgba(125, 141, 255, 0.32);
      }

      .solace-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
      }

      .solace-button--secondary {
        color: #364259;
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.65);
        box-shadow: 0 10px 24px rgba(44, 53, 87, 0.08);
      }

      .solace-input,
      .solace-textarea,
      .solace-select {
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.72);
        background: rgba(255, 255, 255, 0.72);
        border-radius: 22px;
        padding: 18px 20px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
        outline: none;
        transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
      }

      .solace-textarea {
        min-height: 220px;
        resize: vertical;
        line-height: 1.7;
      }

      .solace-input:focus,
      .solace-textarea:focus,
      .solace-select:focus {
        border-color: rgba(125, 141, 255, 0.7);
        box-shadow: 0 0 0 4px rgba(125, 141, 255, 0.12);
      }

      .solace-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(111, 123, 147, 0.25), transparent);
      }

      .solace-tool-accent {
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        opacity: 0.9;
        z-index: 0;
        pointer-events: none;
      }

      .solace-surface {
        position: relative;
        z-index: 1;
      }

      .solace-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .solace-chip {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.6);
        color: #546072;
      }

      .solace-result {
        padding: 26px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.76);
        border: 1px solid rgba(255, 255, 255, 0.65);
        box-shadow: 0 10px 30px rgba(44, 53, 87, 0.06);
      }

      .solace-tool-link {
        display: block;
        border-radius: var(--radius-xl);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        transition:
          transform 180ms ease,
          box-shadow 180ms ease,
          border-color 180ms ease;
      }

      .solace-tool-link:hover {
        transform: translateY(-3px);
      }

      .solace-tool-cta {
        margin-top: auto;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.94rem;
        color: #65728a;
        font-weight: 500;
        letter-spacing: 0.01em;
      }

      .solace-tool-arrow {
        display: inline-block;
        transition: transform 180ms ease;
      }

      .solace-tool-link:hover .solace-tool-arrow {
        transform: translateX(4px);
      }

      .solace-footer {
        padding: 40px 0 60px;
        color: #65728a;
      }

      @keyframes breathe {
        0% {
          transform: scale(1);
          opacity: 0.56;
        }
        50% {
          transform: scale(1.08);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0.56;
        }
      }

      @keyframes solaceOrbBreath {
        0% {
          transform: scale(1);
          box-shadow:
            0 0 0 10px rgba(138,130,255,0.12),
            0 18px 40px rgba(118,108,240,0.30);
        }

        50% {
          transform: scale(1.035);
          box-shadow:
            0 0 0 12px rgba(138,130,255,0.18),
            0 24px 48px rgba(118,108,240,0.38);
        }

        100% {
          transform: scale(1);
          box-shadow:
            0 0 0 10px rgba(138,130,255,0.12),
            0 18px 40px rgba(118,108,240,0.30);
        }
      }

      .solace-breathing-orb {
        width: 84px;
        height: 84px;
        border-radius: 999px;
        animation: breathe 2.6s ease-in-out infinite;
        box-shadow: 0 0 0 14px rgba(255, 255, 255, 0.2);
      }

      @media (max-width: 768px) {
        .solace-page {
          width: min(1120px, calc(100% - 20px));
        }

        .solace-section {
          padding: 28px 0;
        }

        .solace-card,
        .solace-surface-card,
        .solace-tool-link {
          border-radius: 24px;
        }

        .solace-nav {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `}</style>
  );
}