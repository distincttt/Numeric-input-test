import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import NumericInput from '@/components/NumericInput'
import type { NumericValue } from '@/types/numeric-input'

function NumericInputHarness({
  initialValue = null,
  onChange = vi.fn(),
}: {
  initialValue?: NumericValue
  onChange?: (value: NumericValue) => void
}) {
  const [value, setValue] = useState<NumericValue>(initialValue)

  return (
    <NumericInput
      aria-label="Amount"
      value={value}
      onChange={(nextValue) => {
        onChange(nextValue)
        setValue(nextValue)
      }}
    />
  )
}

describe('NumericInput', () => {
  it('has typed jest-dom matchers available in tests', () => {
    render(<button disabled>Save</button>)

    const button = screen.getByRole('button', { name: 'Save' })

    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Save')
    expect(button).toBeDisabled()
  })

  it('accepts only digits and formats them in groups of three', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<NumericInputHarness onChange={handleChange} />)

    await user.type(screen.getByLabelText('Amount'), '12a34b567')

    expect(screen.getByLabelText('Amount')).toHaveValue('1 234 567')
    expect(handleChange).toHaveBeenLastCalledWith('1234567')
  })

  it('cleans pasted text before emitting a raw value', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<NumericInputHarness onChange={handleChange} />)

    await user.click(screen.getByLabelText('Amount'))
    await user.paste('abc1234567xyz')

    expect(screen.getByLabelText('Amount')).toHaveValue('1 234 567')
    expect(handleChange).toHaveBeenLastCalledWith('1234567')
  })

  it('limits typed values to 17 digits', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<NumericInputHarness onChange={handleChange} />)

    await user.type(screen.getByLabelText('Amount'), '1234567890123456789')

    expect(screen.getByLabelText('Amount')).toHaveValue('12 345 678 901 234 567')
    expect(handleChange).toHaveBeenLastCalledWith('12345678901234567')
  })

  it('limits pasted values to 17 digits after removing non-digits', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<NumericInputHarness onChange={handleChange} />)

    await user.click(screen.getByLabelText('Amount'))
    await user.paste('abc1234567890123456789xyz')

    expect(screen.getByLabelText('Amount')).toHaveValue('12 345 678 901 234 567')
    expect(handleChange).toHaveBeenLastCalledWith('12345678901234567')
  })

  it('limits direct value changes to 17 digits', () => {
    const handleChange = vi.fn()
    render(<NumericInputHarness onChange={handleChange} />)

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '1234567890123456789012345' },
    })

    expect(screen.getByLabelText('Amount')).toHaveValue('12 345 678 901 234 567')
    expect(handleChange).toHaveBeenLastCalledWith('12345678901234567')
  })

  it('does not render more than 17 digits from an external value', () => {
    render(<NumericInputHarness initialValue="1234567890123456789012345" />)

    expect(screen.getByLabelText('Amount')).toHaveValue('12 345 678 901 234 567')
  })

  it('emits null when the input becomes empty', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<NumericInputHarness initialValue="1234" onChange={handleChange} />)

    await user.clear(screen.getByLabelText('Amount'))

    expect(screen.getByLabelText('Amount')).toHaveValue('')
    expect(handleChange).toHaveBeenLastCalledWith(null)
  })

  it('deletes the nearby digit when backspacing over a separator', () => {
    const handleChange = vi.fn()
    render(<NumericInputHarness initialValue="1234" onChange={handleChange} />)
    const input = screen.getByLabelText<HTMLInputElement>('Amount')

    input.setSelectionRange(2, 2)
    fireEvent.keyDown(input, { key: 'Backspace' })

    expect(input).toHaveValue('234')
    expect(handleChange).toHaveBeenLastCalledWith('234')
  })
})
