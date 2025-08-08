export default function validateThaiId(id) {
  if (!/^\d{13}$/.test(id)) return false
  const digits = id.split('').map(Number)
  const sum = digits.slice(0, 12).reduce((acc, digit, idx) => acc + digit * (13 - idx), 0)
  const checkDigit = (11 - (sum % 11)) % 10
  return checkDigit === digits[12]
}
