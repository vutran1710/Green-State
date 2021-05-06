import { Dispatch } from 'react'

export const __stores__: Record<string, object> = {}

export class Store<T> {
  _dps: Set<Dispatch<T>>
  _s: T

  constructor(obj: T, name = '__global__') {
    this._s = obj
    this._dps = new Set([])
    __stores__[name] = this
  }

  getState(): T {
    return this._s
  }

  setState(newState: Partial<T>): void {
    this._s = { ...this._s, ...newState }
    this._dps.forEach(dispatch => dispatch(this._s))
  }

  subscribe(dispatch: Dispatch<T>): void {
    this._dps.add(dispatch)
  }

  unsubscribe(dispatch: Dispatch<T>): void {
    this._dps.delete(dispatch)
  }
}
