import "@testing-library/jest-dom"
import * as React from "react"
import { render, fireEvent, screen, act } from "@testing-library/react"
import { Store } from "../src"

type GlobalState = {
  count: number
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test("test hook useGValue", async () => {
  const state: GlobalState = {
    count: 0,
  }

  const { useAction, useGValue } = new Store(state)

  let greet = ""

  const increase = (num: number, { get, set }) => {
    set({ count: get().count + num })
  }

  const changeGreet = (country: string) => {
    greet = `Hello ${country}`
  }

  const asyncIncrease = async (num: number, { get, set }) => {
    await sleep(300)
    set({ count: get().count + num })
  }

  const TestOne = () => {
    const cnt = useGValue("count")[0]
    const inc = useAction(increase)
    const asinc = useAction(asyncIncrease)
    const greeting = useAction(changeGreet)

    const clickAsync = () => asinc(3)
    const handleClick = () => inc(4)
    const makeGreet = () => greeting("Vietnam")

    return (
      <div>
        <button onClick={handleClick} data-testid="inc-4">
          Increase
        </button>
        <button onClick={makeGreet} data-testid="greet">
          Greet
        </button>
        <button onClick={clickAsync} data-testid="asinc-3">
          Async
        </button>
        <p data-testid="message">{`count = ${cnt}`}</p>
      </div>
    )
  }

  await act(async () => render(<TestOne />))
  expect(screen.getByText("count = 0")).not.toBeNull()
  fireEvent.click(screen.getByTestId("inc-4"))
  expect(screen.getByTestId("message").innerHTML).toEqual("count = 4")

  fireEvent.click(screen.getByTestId("greet"))
  expect(greet).toEqual("Hello Vietnam")

  fireEvent.click(screen.getByTestId("asinc-3"))
  expect(screen.getByTestId("message").innerHTML).toEqual("count = 4")
  await sleep(200)
  expect(screen.getByTestId("message").innerHTML).toEqual("count = 4")
  await sleep(200)
  expect(screen.getByTestId("message").innerHTML).toEqual("count = 7")
})
