import { errorManager } from 'extrass'

export function runMultipleOperation(fn: () => Promise<any>, forceData?: any) {
  return new Promise(async (resolve) => {
    try {
      const data = await fn()
      resolve({ data: forceData !== undefined ? forceData : data, ok: true })
    } catch (error) {
      const [message] = errorManager.getErrorInfo(error)
      resolve({ message, ok: false })
    }
  })
}
