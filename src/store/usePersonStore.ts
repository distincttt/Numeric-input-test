import { create } from 'zustand'
import type { Person, PersonState } from '@/types/person'

export const initialPersons: Person[] = [
  { id: 1, name: 'Alice', ageInHours: '262800' },
  { id: 2, name: 'Bob', ageInHours: '350400' },
  { id: 3, name: 'Charlie', ageInHours: '219000' },
]

export const usePersonStore = create<PersonState>((set) => ({
  persons: initialPersons,
  updatePersonAge: (id, ageInHours) =>
    set((state) => ({
      persons: state.persons.map((person) =>
        person.id === id ? { ...person, ageInHours } : person
      ),
    })),
}))
