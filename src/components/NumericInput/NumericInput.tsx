import {
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import type { NumericInputProps } from '@/types/numeric-input'
import {
  countDigitsBefore,
  formatDigits,
  getCaretIndexForDigitPosition,
  sanitizeDigits,
} from '@/utils/numberFormat'

const MAX_DIGITS = 11

export default function NumericInput({
  value,
  onChange,
  minValue,
  className,
  style,
  onBlur,
  onKeyDown,
  ...props
}: NumericInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const nextCaretDigitPositionRef = useRef<number | null>(null)
  const limitedValue = value?.slice(0, MAX_DIGITS) ?? null
  const formattedValue = useMemo(() => formatDigits(limitedValue), [limitedValue])
  const adaptiveStyle = useMemo<CSSProperties>(
    () => ({
      width: `${Math.max(72, formattedValue.length * 12 + 24)}px`,
      ...style,
    }),
    [formattedValue.length, style]
  )

  useLayoutEffect(() => {
    const nextDigitPosition = nextCaretDigitPositionRef.current

    if (nextDigitPosition === null) {
      return
    }

    nextCaretDigitPositionRef.current = null
    const input = inputRef.current

    if (!input) {
      return
    }

    const nextCaretIndex = getCaretIndexForDigitPosition(input.value, nextDigitPosition)
    input.setSelectionRange(nextCaretIndex, nextCaretIndex)
  }, [formattedValue])

  const emitValue = (digits: string, nextDigitPosition: number) => {
    const limitedDigits = digits.slice(0, MAX_DIGITS)

    nextCaretDigitPositionRef.current = Math.min(
      Math.max(nextDigitPosition, 0),
      limitedDigits.length
    )
    onChange(limitedDigits.length > 0 ? limitedDigits : null)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const minimum = Number(minValue ?? 0)
    const current = Number(limitedValue ?? 0)

    if (minimum > 0 && current < minimum) {
      const nextDigits = String(minimum)
      emitValue(nextDigits, nextDigits.length)
    }

    onBlur?.(event)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)

    if (event.defaultPrevented) {
      return
    }

    const input = event.currentTarget
    const selectionStart = input.selectionStart ?? 0
    const selectionEnd = input.selectionEnd ?? selectionStart

    if (selectionStart !== selectionEnd) {
      return
    }

    if (event.key === 'ArrowLeft' && formattedValue[selectionStart - 1] === ' ') {
      event.preventDefault()
      const nextCaretIndex = Math.max(0, selectionStart - 1)
      input.setSelectionRange(nextCaretIndex, nextCaretIndex)
      return
    }

    if (event.key === 'ArrowRight' && formattedValue[selectionStart] === ' ') {
      event.preventDefault()
      const nextCaretIndex = Math.min(formattedValue.length, selectionStart + 1)
      input.setSelectionRange(nextCaretIndex, nextCaretIndex)
      return
    }

    if (event.key !== 'Backspace' && event.key !== 'Delete') {
      return
    }

    if (event.key === 'Backspace' && formattedValue[selectionStart - 1] === ' ') {
      event.preventDefault()
      const rawValue = limitedValue ?? ''
      const removeIndex = countDigitsBefore(formattedValue, selectionStart) - 1
      const nextDigits = rawValue.slice(0, removeIndex) + rawValue.slice(removeIndex + 1)
      emitValue(nextDigits, removeIndex)
    }

    if (event.key === 'Delete' && formattedValue[selectionStart] === ' ') {
      event.preventDefault()
      const rawValue = limitedValue ?? ''
      const removeIndex = countDigitsBefore(formattedValue, selectionStart)
      const nextDigits = rawValue.slice(0, removeIndex) + rawValue.slice(removeIndex + 1)
      emitValue(nextDigits, removeIndex)
    }
  }

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={formattedValue}
      onKeyDown={handleKeyDown}
      onChange={(event) => {
        const nextDisplayValue = event.currentTarget.value
        const nextSelectionStart = event.currentTarget.selectionStart ?? nextDisplayValue.length
        const nextDigits = sanitizeDigits(nextDisplayValue)
        const nextDigitPosition = countDigitsBefore(nextDisplayValue, nextSelectionStart)

        emitValue(nextDigits, nextDigitPosition)
      }}
      onBlur={handleBlur}
      className={className}
      style={adaptiveStyle}
    />
  )
}
