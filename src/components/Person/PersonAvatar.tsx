type PersonAvatarActiveState = 'focus-within' | 'hover' | 'none'

type PersonAvatarProps = {
  name: string
  activeState?: PersonAvatarActiveState
}

const personAvatarWrapperClassName =
  'flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border border-transparent p-0.5 transition-colors duration-150'
const personAvatarImageClassName = 'h-20 w-20 rounded-full object-cover'
const activeStateClassNames: Record<PersonAvatarActiveState, string> = {
  'focus-within': 'group-focus-within:border-[var(--color-avatar-active)]',
  hover: 'group-hover:border-[var(--color-avatar-active)] group-focus-visible:border-[var(--color-avatar-active)]',
  none: '',
}

export default function PersonAvatar({ name, activeState = 'none' }: PersonAvatarProps) {
  return (
    <span className={`${personAvatarWrapperClassName} ${activeStateClassNames[activeState]}`}>
      <img src="/cat.jpg" alt={name} className={personAvatarImageClassName} />
    </span>
  )
}
