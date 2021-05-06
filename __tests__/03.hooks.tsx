import '@testing-library/jest-dom'
import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { useGValue, Store } from '../src'


test('test hook', () => {
  const ShouldBreak = () => {
    const _ = useGValue<{ hello: string }>('hello')
    return (
      <div>
	This should break renderer
      </div>
    )
  }

  let hasThrown = false

  try {
    render(<ShouldBreak />)
  } catch (_) {
    hasThrown = true
  }

  expect(hasThrown).toBe(true)

  type GlobalState = {
    count: number
  }

  const state: GlobalState = {
    count: 0
  }

  new Store(state)

  const TestOne = () => {
    const [cnt, setCnt] = useGValue<GlobalState>('count')
    const handleClick = () => setCnt(cnt + 1)
    return (
      <div>
	<button onClick={handleClick} data-testid="inc-1">Increase</button>
	<p data-testid="message">
	  {`count = ${cnt}`}
	</p>
      </div>
    )
  }

  const TestTwo = () => {
    const [cnt, setCnt] = useGValue<GlobalState>('count')
    const handleClick = () => setCnt(cnt + 3)
    return (
      <div>
	<button onClick={handleClick} data-testid="inc-3">Increase</button>
      </div>
    )
  }

  const message = 'count = 0'
  render((
    <div>
      <TestOne />
      <TestTwo />
    </div>
  ))

  expect(screen.getByText(message)).not.toBeNull()
  fireEvent.click(screen.getByTestId('inc-1'))
  expect(screen.getByTestId('message').innerHTML).toEqual('count = 1')

  fireEvent.click(screen.getByTestId('inc-3'))
  expect(screen.getByTestId('message').innerHTML).toEqual('count = 4')
})
