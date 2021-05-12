import { Dispatch, SetStateAction } from 'react'


export type Dispatcher<T> = Dispatch<SetStateAction<T>> | ((obj: T) => void)


export class Subscriber<T, K extends keyof T> {
    keys: K[]
    dispatch: Dispatcher<T>

    constructor(dispatch: Dispatcher<T>, keys: K[]) {
	this.dispatch = dispatch
	this.keys = keys
    }
}
