import { useState, Dispatch, useEffect } from 'react'
import { Subscriber } from './subscriber'
import * as _ from './help'



export type Keys<T> = keyof T

export type StateSetter<T> = (obj: Partial<T>) => void
export type StateGetter<T> = () => T

export type GValueReturn<T, K extends keyof T> = [T[K], Dispatch<T[K]>]
export type GStateReturn<T, K extends keyof T> = [Pick<T, K[][number]>, (obj: Partial<T>) => void]

export type Action<T, K> = (value: K, { get, set }: { get: StateGetter<T>, set: StateSetter<T> }) => (
  Partial<T> | void | Promise<Partial<T> | void>
)


export class BaseStore<T> {
  state: T
  subs: Map<keyof T, Set<Subscriber<T, Keys<T>>>>

  constructor(
    initialState: T,
  ) {
    this.state = initialState
    this.subs = new Map()
  }

  setState(newState: Partial<T>): void {
    const keys = _.diffing(this.state, newState)
    this.state = { ...this.state, ...newState }
    const subscribers: Set<Subscriber<T, Keys<T>>> = new Set()

    keys.forEach(key => {
      const keySubscribers = this.subs.get(key)

      if (!keySubscribers || !keySubscribers.size) {
        return
      }

      keySubscribers.forEach(s => subscribers.add(s))
    })

    subscribers.forEach(s => {
      const value = _.pickKeys(this.state, s.keys)
      s.dispatch(value)
    })
  }

  getState(): T {
    return this.state
  }

  subscribe<K extends keyof T>(sub: Subscriber<T, K>, keys: K[]): void {
    keys.forEach(key => {
      if (!this.subs.has(key)) {
        this.subs.set(key, new Set([]))
      }
      this.subs.get(key).add(sub)
    })
  }

  unsubscribe<K extends keyof T>(sub: Subscriber<T, K>, keys: K[]): void {
    keys.forEach(key => {
      this.subs.get(key).delete(sub)
    })
  }

  useGValue = <K extends keyof T>(k: K): GValueReturn<T, K> => {
    const [state, setGState] = useState(_.pickKeys(this.state, [k]))
    const subscriber = new Subscriber(setGState, [k])
    useEffect(() => {
      this.subscribe(subscriber, [k])
      return () => this.unsubscribe(subscriber, [k])
    }, [])
    return [
      state[k],
      (obj: T[K]) => this.setState({ [k]: obj } as unknown as Partial<T>),
    ]
  }

  useGState = <K extends keyof T>(...keys: K[]): GStateReturn<T, K> => {
    const [state, setGState] = useState(_.pickKeys(this.state, keys))
    const subscriber = new Subscriber(setGState, keys)
    useEffect(() => {
      this.subscribe(subscriber, keys)
      return () => this.unsubscribe(subscriber, keys)
    }, [])
    const result = keys.reduce((ac, k) => ({ ...ac, [k]: state[k] }), {}) as Pick<T, K[][number]>
    return [
      result,
      (obj: Partial<T>) => this.setState(obj),
    ]
  }

  useAction = <K>(action: Action<T, K>): ((k: K) => void | Promise<void>) => {
    const handleResult = (result: Partial<T> | null | undefined | void): void => {
      if (typeof result === 'object') {
        this.setState(result)
      }
    }

    return (k: K) => {
      const getSet = {
        get: this.getState.bind(this),
        set: this.setState.bind(this)
      }

      const result = action(k, getSet)

      if (result instanceof Promise) {
        return result.then(handleResult)
      }

      return handleResult(result)
    }
  }
}
