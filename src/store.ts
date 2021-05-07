import { useState, Dispatch, useEffect, SetStateAction } from 'react'
import { Subscriber, Dispatcher } from './subscriber'
import * as _ from './help'


export type StateSetter<T> = (obj: Partial<T>) => void
export type Action<T, K> = (value: K, state: T, setState: StateSetter<T>) => Partial<T> | void


export class Store<T extends Record<string, unknown>> {
  _s: T
  _dps: Map<keyof T, Set<Subscriber<T, any>>>

  constructor(obj: T) {
    this._s = obj
    this._dps = new Map()
  }

  setState(newState: Partial<T>): void {
    const keys = _.diffing(this._s, newState)
    this._s = { ...this._s, ...newState }
    const subscribers: Set<Subscriber<T, any>> = new Set()

    keys.forEach(key => {
      const keySubscribers = this._dps.get(key)
      if (keySubscribers.size) {
	keySubscribers.forEach(s => subscribers.add(s))
      }
    })

    subscribers.forEach(s => {
      const value = _.pickKeys(this._s, s.keys)
      s.dispatch(value)
    })
  }

  getState(): T {
    return this._s
  }

  subscribe<K extends keyof T>(sub: Subscriber<T, K>, keys: K[]): void {
    keys.forEach(key => {
      if (!this._dps.has(key)) {
	this._dps.set(key, new Set([]))
      }
      this._dps.get(key).add(sub)
    })
  }

  unsubscribe<K extends keyof T>(sub: Subscriber<T, K>, keys: K[]): void {
    keys.forEach(key => {
      this._dps.get(key).delete(sub)
    })
  }


  useGValue = <K extends keyof T>(k: K): [T[K], Dispatch<T[K]>] => {
    const [state, setGState] = useState(_.pickKeys(this._s, [k]))
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

  useGState = <K extends keyof T>(...keys: K[]): [Pick<T, K[][number]>, (obj: Partial<T>) => void] => {
    const [state, setGState] = useState(_.pickKeys(this._s, keys))
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

  useAction = <K extends unknown>(action: Action<T, K>): ((k: K) => void) => (k: K) => {
    // TODO:
    // - support async/await
    // - set state in the middle
    const state = this.getState()
    const result = action(k, state, this.setState.bind(this))

    if (typeof result === 'object') {
      this.setState(result)
    }
  }
}
