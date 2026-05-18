import type { InputHTMLAttributes } from 'react'

export type NumericValue = string | null

export type NumericInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> & {
  value: NumericValue
  onChange: (value: NumericValue) => void
  minValue?: NumericValue
}
