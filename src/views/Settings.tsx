import { Link } from 'react-router-dom'
import NumericInput from '@/components/NumericInput'
import {
  personFieldClassName,
  personInputClassName,
  personLabelClassName,
  personNavLinkClassName,
  personPageClassName,
  personSecondaryTextClassName,
  personSurfaceClassName,
  personTitleClassName,
} from '@/components/Person/PersonLayout'
import { useSettingsStore } from '@/store'

export default function Settings() {
  const minimumAgeInHours = useSettingsStore((state) => state.minimumAgeInHours)
  const setMinimumAgeInHours = useSettingsStore((state) => state.setMinimumAgeInHours)

  return (
    <div className={personPageClassName}>
      <Link to="/" className={personNavLinkClassName}>
        &larr; Back
      </Link>

      <h1 className={personTitleClassName}>Settings</h1>

      <div className={personSurfaceClassName}>
        <label htmlFor="min-age-input" className={personLabelClassName}>
          MINIMUM AGE
        </label>
        <div className={personFieldClassName}>
          <NumericInput
            id="min-age-input"
            aria-label="Minimum age in hours"
            value={minimumAgeInHours}
            onChange={setMinimumAgeInHours}
            className={personInputClassName}
            placeholder="0"
          />
          <span className={personSecondaryTextClassName}>hours</span>
        </div>
      </div>
    </div>
  )
}
