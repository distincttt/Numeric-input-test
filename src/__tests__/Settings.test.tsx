import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { initialPersons, useSettingsStore, usePersonStore } from '@/store'

function resetStores() {
  usePersonStore.setState({ persons: initialPersons.map((person) => ({ ...person })) })
  useSettingsStore.setState({ minimumAgeInHours: null })
}

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

describe('Settings', () => {
  beforeEach(() => {
    resetStores()
  })

  it('updates the minimum age without filtering persons', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Settings' }))
    await user.type(screen.getByLabelText('Minimum age in hours'), '300000')
    await user.click(screen.getByRole('link', { name: /back/i }))

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('saves edited person age in the store and refreshes the UI', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(within(screen.getByText('Alice').closest('a')!).getByText('Alice'))
    const ageInput = screen.getByLabelText('Alice age in hours')

    await user.clear(ageInput)
    await user.type(ageInput, '1234567')
    await user.click(screen.getByRole('link', { name: /back/i }))

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('1 234 567 hours old')).toBeInTheDocument()
    expect(
      usePersonStore.getState().persons.find((storedPerson) => storedPerson.id === 1)?.ageInHours
    ).toBe('1234567')
  })

  it('clamps edited values below the minimum age in hours', async () => {
    const user = userEvent.setup()
    renderApp(['/settings'])

    await user.type(screen.getByLabelText('Minimum age in hours'), '300000')
    await user.click(screen.getByRole('link', { name: /back/i }))
    await user.click(within(screen.getByText('Charlie').closest('a')!).getByText('Charlie'))

    const ageInput = screen.getByLabelText('Charlie age in hours')

    await user.clear(ageInput)
    await user.type(ageInput, '12')
    await user.click(screen.getByRole('link', { name: /back/i }))

    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.getByText('300 000 hours old')).toBeInTheDocument()
    expect(
      usePersonStore.getState().persons.find((storedPerson) => storedPerson.id === 3)?.ageInHours
    ).toBe('300000')
  })
})
