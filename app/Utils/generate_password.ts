const LOWER_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const UPPER_CASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SPECIAL_CHARACTERS = '!@#$%^&*()_+~`|}{[]:;?><,./-='

export const generatePassword = (length: number) => {
  const password = [...LOWER_CASE_LETTERS, ...UPPER_CASE_LETTERS, ...NUMBERS, ...SPECIAL_CHARACTERS]

  return password
    .sort(() => Math.random() - 0.5)
    .slice(0, length)
    .join('')
}
