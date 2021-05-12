export const diffing = <T, K extends keyof T>(
  state: T,
  newState: Partial<T>
): Set<K> => {
  const updatedKeys = Object.keys(newState)
    .filter((k) => k in state)
    .filter((k) => newState[k] !== state[k]) as K[]

  return new Set(updatedKeys)
}

export const pickKeys = <T, K extends keyof T>(
  state: T,
  keys: K[]
): Pick<T, K[][number]> => {
  const result = keys.reduce((ac, k) => ({ ...ac, [k]: state[k] }), {}) as Pick<
    T,
    K[][number]
  >
  return result
}
