import { useState, Dispatch, useEffect, SetStateAction } from 'react'

type Dispatcher<T> = Dispatch<SetStateAction<T>>

export class GStore<T extends Record<string, any>> {
  _s: T
  _dps: Set<Dispatcher<T>>

  constructor(obj: T) {
    this._s = obj
    this._dps = new Set([])
  }

  setState(newState: Partial<T>): void {
    this._s = { ...this._s, ...newState }
    this._dps.forEach(dispatch => dispatch(this._s))
  }

  subscribe(dispatch: Dispatcher<T>): void {
    this._dps.add(dispatch)
  }

  unsubscribe(dispatch: Dispatcher<T>): void {
    this._dps.delete(dispatch)
  }

  useGValue<K extends keyof T>(k: K): [T[K], Dispatch<T[K]>] {
    const [state, setGState] = useState(this._s)
    useEffect(() => {
      this.subscribe(setGState)
      return () => this.unsubscribe(setGState)
    }, [])
    return [
      state[k],
      (obj: T[K]) => this.setState({ [k]: obj } as unknown as Partial<T>),
    ]
  }

  useGState<K extends keyof T>(...keys: K[]): [Pick<T, K[][number]>, (obj: Partial<T>) => void] {
    const [state, setGState] = useState(this._s)
    useEffect(() => {
      this.subscribe(setGState)
      return () => this.unsubscribe(setGState)
    }, [])
    const result = keys.reduce((ac, k) => ({ ...ac, [k]: state[k] }), {}) as Pick<T, K[][number]>
    return [
      result,
      (obj: Partial<T>) => this.setState(obj),
    ]
  }
}
