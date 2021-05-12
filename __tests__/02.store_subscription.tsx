import "@testing-library/jest-dom"
import { Store } from "../src"
import { Subscriber } from "../src/subscriber"

type State = {
  hello: string
  count: number
}

test("version check", () => {
  const state: State = {
    hello: "Hello",
    count: 0,
  }

  const store = new Store(state)
  expect(store).toBeTruthy()

  let greet = ""

  const subscriber: Subscriber<State, keyof State> = new Subscriber(
    (s) => {
      greet = `${s.hello} World`
    },
    ["hello", "count"]
  )

  store.subscribe(subscriber, ["count", "hello"])

  store.setState({ hello: "Ciao" })
  expect(greet).toEqual("Ciao World")

  const actualHello = store.getState()
  expect(actualHello).toEqual({
    hello: "Ciao",
    count: 0,
  })

  store.unsubscribe(subscriber, ["count", "hello"])
  store.setState({ hello: "Bonjour" })
  expect(greet).toEqual("Ciao World")

  const actualState = store.getState()
  expect(actualState).toEqual({
    hello: "Bonjour",
    count: 0,
  })
})
