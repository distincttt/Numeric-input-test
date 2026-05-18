import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Person } from '@/types/person'
import PersonAvatar from './PersonAvatar'

export const personPageClassName = 'flex w-full max-w-sm flex-col gap-4'
export const personNavLinkClassName =
  'text-sm text-[var(--color-text-default)] opacity-70 hover:opacity-100 hover:underline transition-opacity duration-200 size-max'
export const personInputClassName =
  'rounded border-[1.5px] border-[var(--color-numeric-input-default)] p-[8px] text-lg outline-none focus:border-[var(--color-card-hover-border)] hover:border-[var(--color-input-hover-border)] text-[var(--color-numeric-input-default)] focus:text-[var(--color-text-default)] transition-colors duration-200'
export const personTitleClassName = 'text-xl font-bold text-[var(--color-text-default)]'
export const personLabelClassName =
  "font-['Koulen'] block tracking-[2%] text-base text-[var(--color-text-default)] mb-[12px]"
export const personSecondaryTextClassName = 'text-[var(--color-text-default)]'
export const personFieldClassName = 'flex items-center gap-[12px] text-lg'
export const personSurfaceClassName =
  'rounded-lg border border-[var(--color-surface-border)] bg-white p-4 shadow-sm'

const personCardClassName = `flex items-center gap-3 ${personSurfaceClassName}`
const interactivePersonCardClassName =
  'group transition hover:border-[var(--color-card-hover-border)] hover:shadow-md'
const personLabelLayoutClassName = 'flex w-full cursor-text items-center gap-3'
const personEditLabelLayoutClassName = 'group flex w-full cursor-text items-center gap-[16px]'

type PersonLayoutProps = {
  person: Person
  children: ReactNode
  to?: string
  labelFor?: string
  labelClassName?: string
  contentClassName?: string
}

export default function PersonLayout({
  person,
  children,
  to,
  labelFor,
  labelClassName,
}: PersonLayoutProps) {
  const resolvedLabelClassName =
    labelClassName ?? (labelFor ? personEditLabelLayoutClassName : personLabelLayoutClassName)
  const avatarActiveState = labelFor ? 'focus-within' : to ? 'hover' : 'none'
  const className = [personCardClassName, to ? interactivePersonCardClassName : '']
    .filter(Boolean)
    .join(' ')
  const avatar = <PersonAvatar name={person.name} activeState={avatarActiveState} />
  const body = labelFor ? (
    <>
      {avatar}
      <div>{children}</div>
    </>
  ) : (
    <>
      {avatar}
      <div>{children}</div>
    </>
  )
  const content = labelFor ? (
    <label htmlFor={labelFor} className={resolvedLabelClassName}>
      {body}
    </label>
  ) : (
    body
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
