import '@testing-library/jest-dom'
import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Store, Action } from '../src'


type GlobalState = {
  count: number
}


test('test hook useGValue', () => {
  const state: GlobalState = {
    count: 0
  }

  const { useAction, useGValue } = new Store(state)

  const increase: Action<GlobalState, number> = (num, { count }) => {
    return { count: count + num }
  }

  let greet = ''
  const changeGreet: Action<GlobalState, string> = country => {
    greet = `Hello ${country}`
  }

  const TestOne = () => {
    const cnt = useGValue('count')[0]
    const inc = useAction(increase)
    const greeting = useAction(changeGreet)

    const handleClick = () => inc(4)
    const makeGreet = () => greeting('Vietnam')

    return (
      <div>
	<button onClick={handleClick} data-testid="inc-4">Increase</button>
	<button onClick={makeGreet} data-testid="greet">Greet</button>
	<p data-testid="message">{`count = ${cnt}`}</p>
      </div>
    )
  }

  render(<TestOne />)
  expect(screen.getByText('count = 0')).not.toBeNull()
  fireEvent.click(screen.getByTestId('inc-4'))
  expect(screen.getByTestId('message').innerHTML).toEqual('count = 4')

  fireEvent.click(screen.getByTestId('greet'))
  expect(greet).toEqual('Hello Vietnam')
})
