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
  'clear-your-mind': 'clarity',
  choose: 'decide',
  breakdown: 'decide',
  'break-it-down': 'decide',
}

// Direct tool → RGB lookup (covers tool slugs + category aliases)
const TOOL_RGB: Record<string, string> = {
  // Calm category
  breathing: '60, 192, 212',
  sleep:     '60, 192, 212',
  // Clarity category
  focus:            '232, 168, 62',
  mood:             '232, 168, 62',
  gratitude:        '232, 168, 62',
  clear:            '232, 168, 62',
  'clear-your-mind': '232, 168, 62',
  // Decide category
  choose:          '124, 111, 205',
  breakdown:       '124, 111, 205',
  'break-it-down': '124, 111, 205',
  // Category aliases
  calm:      '60, 192, 212',
  clarity:   '232, 168, 62',
  decide:    '124, 111, 205',
}

const NEUTRAL_FALLBACK = '180, 180, 180'

// Helper: get rgb string for a tool slug (for rgba usage)
// NEVER throws — warns in dev, returns neutral grey in prod
export function getToolRgb(key: string): string {
  const val = TOOL_RGB[key]
  if (val) return val
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[getToolRgb] Unknown key "${key}". Add it to TOOL_RGB in lib/design-tokens.ts.`)
  }
  return NEUTRAL_FALLBACK
}

// Helper: get colour hex for a tool slug
export function getToolColour(toolSlug: string): string {
  const cat = TOOL_CATEGORY[toolSlug]
  if (!cat) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[getToolColour] Unknown toolSlug "${toolSlug}".`)
    }
    return '#B4B4B4'
  }
  return CATEGORY_COLOURS[cat].hex
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
