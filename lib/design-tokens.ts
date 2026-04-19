// ============================================================
// SOLACE DESIGN TOKENS — single source of truth
// All components must import colours and text standards from here
// Never hardcode rgba values or opacity modifiers inline
// ============================================================

// ------------------------------------------------------------
// CATEGORY SYSTEM
// 3 categories, 3 colours, maps to all 8 tools + Lab articles
// ------------------------------------------------------------

export const CATEGORY_COLOURS = {
  calm: {
    name: 'Calm',
    hex: '#3CC0D4',
    rgb: '60, 192, 212',
    tools: ['breathing', 'sleep'],
    labCategory: 'calm-your-state',
    description: 'Regulate your nervous system',
  },
  clarity: {
    name: 'Clarity',
    hex: '#E8A83E',
    rgb: '232, 168, 62',
    tools: ['focus', 'mood', 'gratitude', 'clear'],
    labCategory: 'think-clearly',
    description: 'Understand what\'s happening inside',
  },
  decide: {
    name: 'Decide',
    hex: '#7C6FCD',
    rgb: '124, 111, 205',
    tools: ['choose', 'breakdown'],
    labCategory: 'notice-whats-good',
    description: 'Move forward on something stuck',
  },
} as const

export type CategoryKey = keyof typeof CATEGORY_COLOURS

// ------------------------------------------------------------
// TOOL-TO-CATEGORY MAP
// Single lookup for any tool slug → its category + colour
// ------------------------------------------------------------

export const TOOL_CATEGORY: Record<string, CategoryKey> = {
  breathing: 'calm',
  sleep: 'calm',
  focus: 'clarity',
  mood: 'clarity',
  gratitude: 'clarity',
  clear: 'clarity',
  choose: 'decide',
  breakdown: 'decide',
}

// Helper: get colour hex for a tool slug
export function getToolColour(toolSlug: string): string {
  const cat = TOOL_CATEGORY[toolSlug]
  return cat ? CATEGORY_COLOURS[cat].hex : '#3CC0D4'
}

// Helper: get rgb string for a tool slug (for rgba usage)
export function getToolRgb(toolSlug: string): string {
  const cat = TOOL_CATEGORY[toolSlug]
  return cat ? CATEGORY_COLOURS[cat].rgb : '60, 192, 212'
}

// Helper: get category for a tool slug
export function getToolCategory(toolSlug: string): CategoryKey {
  return TOOL_CATEGORY[toolSlug] ?? 'calm'
}

// Helper: get colour for a Lab category slug
export function getLabCategoryColour(labCategory: string): string {
  const match = Object.values(CATEGORY_COLOURS).find(
    c => c.labCategory === labCategory
  )
  return match ? match.hex : '#E8A83E'
}

export function getLabCategoryRgb(labCategory: string): string {
  const match = Object.values(CATEGORY_COLOURS).find(
    c => c.labCategory === labCategory
  )
  return match ? match.rgb : '232, 168, 62'
}

// ------------------------------------------------------------
// TEXT OPACITY STANDARDS
// Use these constants — never write raw opacity values inline
// ------------------------------------------------------------

export const TEXT_OPACITY = {
  // Primary content — headings, key labels
  primary: 1.0,
  // Body text, descriptions, paragraph copy
  body: 0.80,
  // Secondary content — metadata, dates, supporting copy
  secondary: 0.65,
  // Tertiary — hints, placeholders, purely decorative
  tertiary: 0.45,
  // Disabled states
  disabled: 0.30,
} as const

// Helper: build rgba string from white + opacity token
export function textWhite(opacity: number): string {
  return `rgba(255, 255, 255, ${opacity})`
}

// Pre-built text colour values for inline use
export const TEXT_COLOURS = {
  primary: 'rgba(255, 255, 255, 1.0)',
  body: 'rgba(255, 255, 255, 0.80)',
  secondary: 'rgba(255, 255, 255, 0.65)',
  tertiary: 'rgba(255, 255, 255, 0.45)',
  disabled: 'rgba(255, 255, 255, 0.30)',
} as const

// ------------------------------------------------------------
// FONT SIZE FLOORS (in px)
// Never go below these for the given content role
// ------------------------------------------------------------

export const FONT_SIZE = {
  // Functional labels: streak counters, history labels, section headings
  functionalLabel: 12,
  // Body / description text
  body: 14,
  // Eyebrow pills, category tags, uppercase tracking labels
  eyebrow: 11,
  // Button labels, CTA text
  button: 13,
  // Metadata: dates, read time, back links
  metadata: 12,
} as const

// ------------------------------------------------------------
// GLASS CARD HELPERS
// Standard tinted glass card backgrounds per category
// ------------------------------------------------------------

export function glassBackground(toolSlug: string, opacity = 0.08): string {
  const rgb = getToolRgb(toolSlug)
  return `rgba(${rgb}, ${opacity})`
}

export function glassBorder(toolSlug: string, opacity = 0.25): string {
  const rgb = getToolRgb(toolSlug)
  return `rgba(${rgb}, ${opacity})`
}
