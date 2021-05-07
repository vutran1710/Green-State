import '@testing-library/jest-dom'
import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Store } from '../src'


type GlobalState = {
  count: number
}


test('test hook useGValue', () => {
  const state: GlobalState = {
    count: 0
  }

  const { useGValue } = new Store(state)
  const TestOne = () => {
    const [cnt, setCnt] = useGValue('count')
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
    const [cnt, setCnt] = useGValue('count')
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


test('test hook useGState', () => {
  type GlobalState = {
    hello: string
    count: number
    dumb: number
  }

  const state: GlobalState = {
    hello: 'world',
    count: 0,
    dumb: 0
  }

  const { useGState } = new Store(state)

  const TestOne = () => {
    const [cnt, setCnt] = useGState('count', 'hello')
    const handleClick = () => setCnt({ count: cnt.count + 1 })
    return (
      <div>
	<button onClick={handleClick} data-testid="inc-1">Increase</button>
	<p data-testid="message">
	  {`count = ${cnt.count}`}
	</p>
      </div>
    )
  }

  const TestTwo = () => {
    const [cnt, setCnt] = useGState('count', 'hello')
    const handleClick = () => setCnt({ count: cnt.count + 3 })
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
