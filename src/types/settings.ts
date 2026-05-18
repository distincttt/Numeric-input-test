import type { NumericValue } from './numeric-input'

export type SettingsState = {
  minimumAgeInHours: NumericValue
  setMinimumAgeInHours: (hours: NumericValue) => void
}
