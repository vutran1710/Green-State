<br />
<p align="center">
  <a href="https://github.com/vutran1710/Green-State">
	<img src="https://raw.githubusercontent.com/vutran1710/Green-State/master/doc/logo.png" alt="Logo" width="500">
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
There has been numerous open-source projects that try to tackle the problem with React shared state. Well here is the news for you: I tried them all. Sorry I lied - I mean most of them. But then here is another bad news: most of them are overly complicated, with unfriendly API and introduce way too much brain-load as well as boilerplate code. Not pointing any finger but well, if you know, you know!

Now since I'm pretty lazy and impatient, I tend to use something that is WAAAY easier to understand, with minimal APIs and flat-learning curve. One of the few best stuffs that may fall in such cateogry I would honor here is *zustand* and *redux-zero*. *Redux-zero* is great for those who love to stick with Redux's style, while *zustand* is nice for modern adopters who favors *react-hooks*.

Problem is, I need a hook-based tool to manage global/shared state between components. I don't like writing too many code to handle tiny problems. Yet I don't feel quite right with *zustand*, meanwhile I'm done with *Redux* for ages already. Well that means I have to do it myself - the way I like. And I hope you would like it as well.

### Built With

* typescript
* that's it!


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is a React stuff, so naturally you need React - more specifically the version that supports **hook** - unless you are Gandalf the Grey with latest upgraded magic that breath stuffs out of thin air!

### Installation

Install NPM packages
   ```sh
   npm install @vutr/gstate
   ```



<!-- USAGE EXAMPLES -->
## Usage

- First, setup your state store with *GreenState*
```typescript
// ./state
type GlobalState = {
  count: number
  hello: string
}

const state: GlobalState = {
  count: 0,
  hello: 'World'
}

const store = new Store(state)
export default store
```

- Second, use The-Damn-Store!! Your precious state will be shared between components.
```typescript
// ./component
import { useGValue, useGState, useAction } from './state'

const TestOne = () => {
  const [cnt, setCnt] = useGValue('count')
  const handleClick = () => setCnt(cnt + 1)
  return (
	<div>
	  <button onClick={handleClick} data-testid="inc-1">Increase</button>
	  <p data-testid="message">{`count = ${cnt}`}</p>
	</div>
  )
}

const TestTwo = () => {
  const [obj, setObj] = useGState('count', 'hello')
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

### Store
```javascript
import { Store } from '@vutr/gstate'
type GlobalState = {
  count: number
  hello: string
}

const state: GlobalState = {
  count: 0,
  hello: 'World'
}

const store = new Store(state)
```

### useGValue

get and set a single value from *State* using its key.
```javascript
import { useGValue } from './state'
const [cnt, setCnt] = useGValue('count')
console.log(cnt) // 0
console.log(setCnt) // Function(x: number) => void
// type inferred from the value of `count`
```

### useGState

get and set a collection of value from *State* using their keys.
```javascript
import { useGValue } from './state'
const [obj, setObj] = useGState('count', 'hello')
console.log(obj) // { count: 0, hello: 'World'}
console.log(setObj) // Function(x: Partial<State>) => void
// type inferred from the value of `keys` passed to useGState
```

### useAction

- Define an action and use it to update the State
- If an action return part of the State, it will be merged to the State, otherwise nothing will happen
- There will be more updates to *useAction* to support async/await or setState in the middleo of *action* logic soon.
```javascript
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

```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Vu Tran  - me@vutr.io

Project Link: [https://github.com/vutran1710/Green-State](https://github.com/vutran1710/Green-State)
