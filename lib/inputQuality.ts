export function cleanInput(value: string) {
  return value.trim()
}

export function isLikelyPlaceholder(value: string) {
  const text = value.trim().toLowerCase()

  if (!text) return true

  const obviousPlaceholders = [
    "asdf",
    "asdfg",
    "qwerty",
    "test",
    "testing",
    "abc",
    "123",
    "1234",
    "hello",
    "hi",
    "nothing",
    "n/a",
    "na",
    "idk",
    "???",
    "...",
  ]

  if (obviousPlaceholders.includes(text)) return true

  const onlyRepeatedChar = /^([a-z0-9])\1{2,}$/i.test(text)
  if (onlyRepeatedChar) return true

  const tooShortAndMeaningless =
    text.length <= 4 && !text.includes(" ") && /^[a-z0-9]+$/i.test(text)

  return tooShortAndMeaningless
}

export function hasLowInformationText(value: string, minimumLength = 12) {
  const text = cleanInput(value)

  if (!text) return true
  if (isLikelyPlaceholder(text)) return true
  if (text.length < minimumLength) return true

  return false
}

export function hasLowInformationFields(values: string[], minimumTotalLength = 18) {
  const cleaned = values.map(cleanInput).filter(Boolean)

  if (cleaned.length === 0) return true

  const meaningful = cleaned.filter((value) => !isLikelyPlaceholder(value))

  if (meaningful.length === 0) return true

  const totalLength = meaningful.join(" ").length

  return meaningful.length < 2 || totalLength < minimumTotalLength
}