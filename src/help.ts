export const diffing = <T extends object, K extends keyof T>(state: T, newState: Partial<T>): Set<K> => {
  const keys = new Set([])
  for (const key in newState) {
    const newVal = newState[key]
    const currentVal = state[key]
    if (newVal !== currentVal) keys.add(key)
  }
  return keys
}


export const pickKeys = <T extends object, K extends keyof T>(state: T, keys: K[]): Pick<T, K[][number]> => {
  const result = keys.reduce((ac, k) => ({ ...ac, [k]: state[k] }), {}) as Pick<T, K[][number]>
  return result
}
