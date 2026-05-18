import type { NumericValue } from '@/types/numeric-input'

export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatDigits(value: NumericValue): string {
  if (!value) {
    return ''
  }

  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function toNumericValue(value: string): NumericValue {
  const digits = sanitizeDigits(value)
  return digits.length > 0 ? digits : null
}

export function countDigitsBefore(value: string, caretIndex: number): number {
  return sanitizeDigits(value.slice(0, Math.max(0, caretIndex))).length
}

export function getCaretIndexForDigitPosition(
  formattedValue: string,
  digitPosition: number
): number {
  if (digitPosition <= 0) {
    return 0
  }

  let digitsSeen = 0

  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index])) {
      digitsSeen += 1
    }

    if (digitsSeen === digitPosition) {
      return index + 1
    }
  }

  return formattedValue.length
}
