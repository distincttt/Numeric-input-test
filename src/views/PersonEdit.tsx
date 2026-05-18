import { Link, useParams } from 'react-router-dom'
import NumericInput from '@/components/NumericInput'
import PersonLayout, {
  personFieldClassName,
  personInputClassName,
  personLabelClassName,
  personNavLinkClassName,
  personPageClassName,
  personSecondaryTextClassName,
} from '@/components/Person/PersonLayout'
import { useSettingsStore, usePersonStore } from '@/store'

export default function PersonEdit() {
  const { id } = useParams<{ id: string }>()
  const person = usePersonStore((state) =>
    state.persons.find((storedPerson) => storedPerson.id === Number(id))
  )
  const updatePersonAge = usePersonStore((state) => state.updatePersonAge)
  const minimumAgeInHours = useSettingsStore((state) => state.minimumAgeInHours)
  const ageInputId = 'age-input'

  if (!person) {
    return (
      <div>
        <p className={personSecondaryTextClassName}>Person not found</p>
        <Link to="/" className={personNavLinkClassName}>
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className={personPageClassName}>
      <Link to="/" className={personNavLinkClassName}>
        &larr; Back
      </Link>

      <PersonLayout person={person} labelFor={ageInputId}>
        <div className={`${personLabelClassName} group-focus-within:text-[var(--color-avatar-active)]`}>{person.name.toUpperCase()} IS</div>
        <div className={personFieldClassName}>
          <NumericInput
            id={ageInputId}
            aria-label={`${person.name} age in hours`}
            value={person.ageInHours}
            minValue={minimumAgeInHours}
            onChange={(nextAge) => updatePersonAge(person.id, nextAge)}
            className={personInputClassName}
            placeholder="0"
          />
          <span className={personSecondaryTextClassName}>hours old</span>
        </div>
      </PersonLayout>
    </div>
  )
}
