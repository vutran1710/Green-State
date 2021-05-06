import { Dispatch } from 'react'

export class Store<T> {
  _dps: Set<Dispatch<T>>
  _s: T

  constructor(obj: T) {
    this._s = obj
    this._dps = new Set([])
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
