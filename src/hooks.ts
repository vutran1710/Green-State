import { useState, Dispatch, useEffect } from 'react'
import { __stores__, Store } from './store'


export type Keys<T extends object> = keyof T
export type UseGValue<K extends object, T extends Keys<K>> = [K[T], Dispatch<K[T]>]
export type UseGState<K extends object, T extends Keys<K>[]> = [Pick<K, T[number]>, Dispatch<Partial<K>>]
export type Action<K extends object, T> = (value: T, state: K) => Partial<K> | void


export const useGValue = <K extends object>(k: keyof K, name = '__global__'): UseGValue<K, keyof K> => {
  const store = __stores__[name] as Store<K>
  if (!store) throw new Error(`store ${name} does not exist`)
  const [state, setGState] = useState(store.getState())
  useEffect(() => {
    store.subscribe(setGState)
    return () => store.unsubscribe(setGState)
  }, [])
  return [state[k], (obj: K[typeof k]) => store.setState({ [k]: obj } as Partial<K>)]
}
