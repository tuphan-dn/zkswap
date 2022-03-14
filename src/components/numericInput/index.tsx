import { ChangeEvent, useCallback, useRef, useState } from 'react'

import { Input, Tooltip, Space, InputProps } from 'antd'
import IconSax from 'components/iconsax'

export type NumericInputProps = {
  value?: string | number
  onChange?: (value: string | number) => void
  max?: number
} & Omit<InputProps, 'value' | 'onChange'>

let timeoutId: ReturnType<typeof setTimeout> | undefined

const MIN = 0
const MAX = 10 ** 6

const NumericInput = (
  { value = '', onChange = () => {}, max = MAX, ...props }: NumericInputProps,
  ref: any,
) => {
  const [error, setError] = useState('')
  const [cursor, setCursor] = useState<number | null>(null)
  const innerRef = useRef(ref)

  const onAmount = useCallback(
    (value) => {
      const onError = (er: string) => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = undefined
        }
        setError(er)
        timeoutId = setTimeout(() => setError(''), 500)
      }
      if (value === '') return onChange('')
      const amount = parseInt(value)
      if (value !== amount.toString() || amount < MIN)
        return onError(
          'Due to discrete log limitation, the input only supports integers in a range from 0 to 1,000,000.',
        )
      if (amount > max) return onError('Insufficient balance.')
      return onChange(amount)
    },
    [onChange, max],
  )

  // Handle cursor jumping
  // To prevent autofocus on mobile, we must strictly check cursor different from null
  if (cursor !== null) innerRef?.current?.setSelectionRange(cursor, cursor)

  return (
    <Tooltip
      title={
        <Space>
          <IconSax name="Warning2" />
          {error}
        </Space>
      }
      visible={!!error}
    >
      <Input
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setCursor(e.target.selectionStart)
          onAmount(e.target.value || '')
        }}
        value={value}
        {...props}
        ref={innerRef}
      />
    </Tooltip>
  )
}

export default NumericInput
