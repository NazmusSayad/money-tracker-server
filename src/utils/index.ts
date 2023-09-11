import { catchError } from 'extrass'

export function deepCatchError<T extends object>(object: T): T {
  return Object.fromEntries(
    Object.entries(object).map(([key, controller]) => [
      key,
      catchError(controller),
    ])
  ) as T
}
