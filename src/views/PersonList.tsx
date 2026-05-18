import { Link } from 'react-router-dom'
import PersonCard from '@/components/Person/PersonCard'
import {
  personNavLinkClassName,
  personPageClassName,
  personTitleClassName,
} from '@/components/Person/PersonLayout'
import { usePersonStore } from '@/store'

export default function PersonList() {
  const persons = usePersonStore((state) => state.persons)

  return (
    <div className={personPageClassName}>
      <div className="flex items-center justify-between gap-4">
        <h1 className={personTitleClassName}>Persons</h1>
        <Link to="/settings" className={personNavLinkClassName}>
          Settings
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {persons.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  )
}
