import { BaseStore, GStateReturn, GValueReturn } from './base_store'

export type GDerivedState<T, K> = (state: T) => K


export class Store<T, D> extends BaseStore<T> {
  derivedStore: BaseStore<D>
  deriveFunc: GDerivedState<T, D>

  constructor(state: T, derived: GDerivedState<T, D> = (() => ({}) as D)) {
    super(state)
    this.deriveFunc = derived
    this.derivedStore = new BaseStore(derived(this.state))
  }

  setState(n: Partial<T>): void {
    super.setState(n)
    this.derivedStore.setState(this.deriveFunc(this.state))
  }

  get useDerivedValue(): (<L extends keyof D>(k: L) => GValueReturn<D, L>[0]) {
    const useDerivedValue = <L extends keyof D>(k: L) => this.derivedStore.useGValue(k)[0]
    return useDerivedValue
  }

  get useDerivedState(): (<L extends keyof D>(...k: L[]) => GStateReturn<D, L>[0]) {
    const useDerivedState = <L extends keyof D>(...k: L[]) => this.derivedStore.useGState(...k)[0]
    return useDerivedState
  }
}
