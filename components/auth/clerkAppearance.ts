export const authClerkAppearance = {
  variables: {
    colorBackground: "transparent",
    colorPrimary: "rgba(240,234,255,0.94)",
    colorText: "rgba(240,234,255,0.94)",
    colorTextSecondary: "rgba(195,188,230,0.78)",
    colorDanger: "#f5a3b7",
    colorSuccess: "#a7f3d0",
    borderRadius: "24px",
    fontFamily: "'Jost', sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card:
      "w-full max-w-[520px] rounded-[24px] border border-white/[0.12] bg-white/[0.04] p-0 shadow-none backdrop-blur-[14px]",
    header: "px-9 pt-10 pb-0",
    headerTitle:
      "font-['Cormorant_Garamond',serif] text-[clamp(34px,4.5vw,46px)] font-light leading-[1.1] text-[rgba(240,234,255,0.94)]",
    headerSubtitle:
      "mt-3 font-['Jost',sans-serif] text-[15px] font-light leading-[1.7] text-[rgba(195,188,230,0.78)]",
    main: "px-9 pt-6 pb-8",
    form: "gap-3",
    formFieldLabel:
      "mb-1 font-['Jost',sans-serif] text-[11px] font-normal uppercase tracking-[0.16em] text-[rgba(185,175,220,0.6)]",
    formFieldInput:
      "h-11 rounded-[10px] border border-white/[0.16] bg-[rgba(9,13,20,0.75)] px-[14px] text-[14px] text-[rgba(240,234,255,0.94)] placeholder:text-[rgba(195,188,230,0.48)] shadow-none",
    formButtonPrimary:
      "mt-1 h-11 rounded-full border border-[rgba(200,195,235,0.28)] bg-white/[0.08] text-[13px] font-normal uppercase tracking-[0.08em] text-[rgba(240,234,255,0.94)] shadow-none hover:bg-white/[0.12]",
    footer: "px-9 pb-10 pt-0",
    footerAction:
      "font-['Jost',sans-serif] text-[13px] text-[rgba(195,188,230,0.78)]",
    footerActionText: "text-[rgba(195,188,230,0.78)]",
    footerActionLink:
      "text-[rgba(240,234,255,0.94)] no-underline hover:text-white",
    formResendCodeLink:
      "font-['Jost',sans-serif] text-[13px] text-[rgba(240,234,255,0.94)] hover:text-white",
    formFieldErrorText:
      "mt-1 font-['Jost',sans-serif] text-[12px] text-[#f5a3b7]",
    alert:
      "rounded-[12px] border border-[#f5a3b7]/30 bg-[#f5a3b7]/10 text-[#f8d0da] shadow-none",
    alertText: "text-[13px] leading-6",
    identityPreviewText: "text-[rgba(240,234,255,0.94)]",
    identityPreviewEditButton:
      "text-[rgba(240,234,255,0.94)] hover:text-white",
    formFieldSuccessText: "text-[13px] text-[#b7f1d4]",
    otpCodeFieldInput:
      "h-11 w-11 rounded-[10px] border border-white/[0.16] bg-[rgba(9,13,20,0.75)] text-[rgba(240,234,255,0.94)] shadow-none",
    alternativeMethodsBlockButton:
      "rounded-full border border-white/[0.16] bg-white/[0.04] text-[12px] uppercase tracking-[0.08em] text-[rgba(240,234,255,0.88)] hover:bg-white/[0.08]",
    socialButtonsBlockButton:
      "rounded-full border border-white/[0.16] bg-white/[0.04] text-[12px] uppercase tracking-[0.08em] text-[rgba(240,234,255,0.88)] hover:bg-white/[0.08]",
    dividerRow: "before:bg-white/[0.12] after:bg-white/[0.12]",
    dividerText:
      "font-['Jost',sans-serif] text-[10px] uppercase tracking-[0.18em] text-[rgba(185,175,220,0.45)]",
  },
} as const;
