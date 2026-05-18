import type { PersonCardProps } from '@/types/person'
import { formatDigits } from '@/utils/numberFormat'
import PersonLayout, { personLabelClassName, personSecondaryTextClassName } from './PersonLayout'

export default function PersonCard({ person }: PersonCardProps) {
  return (
    <PersonLayout person={person} to={`/person/${person.id}`}>
      <div className={`${personLabelClassName} group-hover:text-[var(--color-avatar-active)]`}>{person.name}</div>
      <div className={personSecondaryTextClassName}>
        {formatDigits(person.ageInHours) || 0} hours old
      </div>
    </PersonLayout>
  )
}
