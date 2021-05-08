import '@testing-library/jest-dom'
import * as React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import { Store } from '../src'



test('test hook useGValue', async () => {
  type State = {
    count1: number
    count2: number
  }

  type DerivedState = {
    total: number
    divided: number
  }

  const state: State = {
    count1: 1,
    count2: 1,
  }

  const derived = (state: State): DerivedState => ({
    total: state.count1 + state.count2,
    divided: state.count1 / state.count2,
  })

  const { useGValue, useDerivedValue, useDerivedState } = new Store(state, derived)

  const TestOne = () => {
    const [cnt, setCnt] = useGValue('count1')
    const total = useDerivedValue('total')
    const divided = useDerivedValue('divided')
    const totalObject = useDerivedState('total', 'divided')
    const handleClick = () => setCnt(4)

    return (
      <div>
	<button onClick={handleClick} data-testid="inc-4">Increase</button>
	<p data-testid="count">{`count = ${cnt}`}</p>
	<p data-testid="total">{`total = ${total}`}</p>
	<p data-testid="divided">{`divided = ${divided}`}</p>
	<p data-testid="derived">{`derived = ${totalObject.divided}`}</p>
      </div>
    )
  }

  await act(async () => render(<TestOne />))
  expect(screen.getByText('count = 1')).not.toBeNull()
  expect(screen.getByText('total = 2')).not.toBeNull()
  fireEvent.click(screen.getByTestId('inc-4'))
  expect(screen.getByTestId('count').innerHTML).toEqual('count = 4')
  expect(screen.getByTestId('total').innerHTML).toEqual('total = 5')
  expect(screen.getByTestId('divided').innerHTML).toEqual('divided = 4')
})
