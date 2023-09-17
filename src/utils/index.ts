import { catchError } from 'extrass'

export function deepCatchError<T extends object>(object: T): T {
  return Object.fromEntries(
    Object.entries(object).map(([key, controller]) => [
      key,
      catchError(controller),
    ])
  ) as T
}

export function originToDomain(url: string) {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/
  const match = url.match(regex)

  if (match) return match[1]
}
