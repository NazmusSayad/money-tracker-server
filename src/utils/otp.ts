const characters = '0123456789'
const charactersLength = characters.length

export function generateOTP(length: number) {
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters[randomIndex]
  }

  return result.toUpperCase()
}
