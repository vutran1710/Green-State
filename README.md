<br />
<p align="center">
  <a href="https://github.com/vutran1710/Green-State">
    <img src="https://raw.githubusercontent.com/vutran1710/Green-State/master/doc/logo.png" alt="Logo" width="450">
  </a>

  <p align="center">
    Manage React global/shared state while preserving nature by writing less CODE!
    <br />
    <a href="https://github.com/vutran1710/Green-State"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/vutran1710/Green-State/issues">Report Bug</a>
    ·
    <a href="https://github.com/vutran1710/Green-State/issues">Request Feature</a>
  </p>
</p>

There has been numerous open-source projects that try to tackle the problem with React shared state, but here is a bad news: most of them are overly complicated, with unfriendly API and introduce way too much brain-load as well as boilerplate code.

What if we can have a Library with minimal APIs and flat-learning curve that will not take us more than 5 minutes to grasp? One of the few best stuffs that may fall in such cateogry I would honor here is _zustand_ and _redux-zero_. _Redux-zero_ is great for those who love to stick with Redux's style, while _zustand_ is nice for modern adopters who favor _react-hooks_.

Yet though I love hooks, I don't feel quite right with _zustand_, meanwhile I'm done with _Redux_ for ages already. Well that means I have to do it myself - the way I like. And I hope you would like it as well.

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#apis">APIs</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

GreenState is a state-management library that helps develop shared or global state between components using the sweet React-Hooks. The Aim is to provide one of the friendlies API that - as _Steve Job_ used to say - `It just works!`.

```
Let's say, you declare **Your State**, ask a key name - that's simple -  and GreenState returns just its value to you??
```

You can use it to create as many stores as you like. The APIs are minmal, support all basic cases, including..

1. Get a single value from Store
2. Get a group of values from Store
3. Get a derived-value / composed-value from Store (just like you would with RecoilSelector)
4. Dispatch an action to update store - either _async_ or non-asynchronous
5. Intuitive type-hint support with typescript!
6. Maximum coverage (100%)!

### Built With

- typescript
- that's it!

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

This is a React stuff, so naturally you need React - more specifically the version that supports **hook** - unless you are Gandalf the Grey who can pretty much do whatever he likes without `npm`!

### Installation

Install NPM packages

```sh
npm install @vutr/gstate
```

<!-- USAGE EXAMPLES -->

## Usage

- First, setup your state store with _GreenState_

```typescript
// ./state
import { Store } from "@vutr/gstate"

type GlobalState = {
  count: number
  hello: string
}

const state: GlobalState = {
  count: 0,
  hello: "World",
}

const store = new Store(state)

export const useGValue = store.useGValue
export const useGState = store.useGState
export const useAction = store.useAction
```

- Second, use The-Damn-Store!! Your precious state will be shared between components.

```typescript
// ./component
import { useGValue, useGState, useAction } from "./state"

const TestOne = () => {
  const [cnt, setCnt] = useGValue("count")
  const handleClick = () => setCnt(cnt + 1)
  return (
    <div>
      <button onClick={handleClick} data-testid="inc-1">
        Increase
      </button>
      <p data-testid="message">{`count = ${cnt}`}</p>
    </div>
  )
}

const TestTwo = () => {
  const [obj, setObj] = useGState("count", "hello")
  const handleClick = () => setObj({ count: cnt.count + 3 })
  return (
    <div>
      <button onClick={handleClick} data-testid="inc-3">
        Increase
      </button>
    </div>
  )
}
```

<!-- APIs -->

## APIs

**Store(intialState: Record<string, any>, derivedState?: (state) => Record<string, any>)**

- Aside from defining **initialState**, you can optionally have **derivedState** passed to **Store**. The _derivedState_ is something just like _RecoilSelector_, or React's _getDerivedState_
- Combine everything we have something like...

```javascript
import { Store } from '@vutr/gstate'
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

const store = new Store(state, derived)

export const useGValue = store.useGValue
export const useGState = store.useGState
export const useAction = store.useAction
export const useDerivedValue = store.useDerivedValue
export const useDerivedState = store.useDerivedState
```

**useGValue(key: keyof State) => [State[key], Dispatch<State[key]>]**

- get and set a single value from _State_ using its key.

```javascript
import { useGValue } from "./state"
const [cnt, setCnt] = useGValue("count")

console.log(cnt) // 0
console.log(setCnt) // Function(x: number) => void; type inferred from the value of `count`
setCnt(1)
console.log(cnt) // 1
```

**useGState(...keys: keyof State[]) => [Pick<State, keys>, (obj: Partial<State>) => void]**

- get and set a collection of value from _State_ using their keys.

```javascript
import { useGValue } from "./state"
const [obj, setObj] = useGState("count", "hello")
console.log(obj) // { count: 0, hello: 'World'}
console.log(setObj) // Function(x: Partial<State>) => void
// type inferred from the value of `keys` passed to useGState
```

**useAction(action: Action<State, args>) => (args, { get, set }) => Partial<State> | void**

```typescript
type Action<T extends StateObj, K> = (value: K, { get: StateGetter<T>, set: StateSetter<T> }) => (
  Partial<T> | void | Promise<Partial<T> | void>
)
```

- Define an action and use it to update the State
- If an action return part of the State, it will be merged to the State, otherwise nothing will happen
- Action can be either asynchronous or synchronous - meaning async/await works just fine
- _get_ State or _set_ State freely

```javascript
const { useAction, useGValue, StateSetter } = new Store(state)

const increase = (num, { count }) => {
  return { count: count + num }
}

const asyncIncrease = async (num: number, { get, set }) => {
  await sleep(300)
  set({ count: get().count + num })
}

let greet = ""
const changeGreet: Action<GlobalState, string> = (country, { set }) => {
  greet = `Hello ${country}`
  set({ hello: "Ciao" })
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
```

- **useDerivedValue(key: K extends keyof DerivedState) => DerivedState[K]**

- **useDerivedState(...keys: Array<K extends keyof DerivedState>) => Pick<DerivedState, keys>**

Example

```typescript
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

const { useGValue, useDerivedValue, useDerivedState } = new Store(
  state,
  derived
)

const TestOne = () => {
  const total = useDerivedValue("total")
  const totalObject = useDerivedState("total", "divided")

  return (
    <div>
      <p data-testid="total">{`total = ${total}`}</p>
      <p data-testid="derived">{`derived = ${totalObject.divided}`}</p>
    </div>
  )
}
```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Vu Tran - me@vutr.io

Project Link: [https://github.com/vutran1710/Green-State](https://github.com/vutran1710/Green-State)
