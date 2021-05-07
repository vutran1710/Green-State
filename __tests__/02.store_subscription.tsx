import '@testing-library/jest-dom'
import { Dispatch } from 'react'
import { Store } from '../src'

type State = {
  hello: string
  count: number
}

test('version check', () => {
  const state: State = {
    hello: 'Hello',
    count: 0,
  }


  const store = new Store(state)
  expect(store).toBeTruthy()

  let greet = ''

  const subscriber: Dispatch<State> = (s) => {
    greet = `${s.hello} World`
  }

  store.subscribe(subscriber)

  store.setState({ hello: 'Ciao' })
  expect(greet).toEqual('Ciao World')

  const actualHello = store.getState()
  expect(actualHello).toEqual({
    hello: 'Ciao',
    count: 0,
  })

  store.unsubscribe(subscriber)
  store.setState({ hello: 'Bonjour' })
  expect(greet).toEqual('Ciao World')

  const actualState = store.getState()
  expect(actualState).toEqual({
    hello: 'Bonjour',
    count: 0.
  })
})
