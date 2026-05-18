import type { NumericValue } from './numeric-input'

export type Person = {
  id: number
  name: string
  ageInHours: NumericValue
}

export type PersonState = {
  persons: Person[]
  updatePersonAge: (id: number, ageInHours: NumericValue) => void
}

export type PersonCardProps = {
  person: Person
}
