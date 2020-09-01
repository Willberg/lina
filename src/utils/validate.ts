export const isValidUsername = (str: string) => /^[a-zA-Z0-9]{8,}$/.test(str.trim())
export const isValidEmail = (str: string) => /^[a-zA-Z0-9]+\_*[a-zA-Z0-9]*@[a-z0-9]+\.[a-z]+$/.test(str.trim())
export const isValidPhoneNumber = (str: string) => /^[0-9]{11}$/.test(str.trim())
export const isValidLoginUser = (str: string) => isValidUsername(str.trim()) || isValidEmail(str.trim()) || isValidPhoneNumber(str.trim())
export const isValidPassword = (str: string) => {
  const s = str.trim()
  if (s !== str) {
    return false
  }

  if (s.length < 6) {
    return false
  }

  let offset = 1
  let hasLow = false
  let hasUpper = false
  let hasNumber = false
  let hasSpecial = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] >= 'a' && s[i] <= 'z') {
      if (!hasLow) {
        offset = offset << 1
        hasLow = true
      }
    } else if (s[i] >= 'A' && s[i] <= 'Z') {
      if (!hasUpper) {
        offset = offset << 1
        hasUpper = true
      }
    } else if (s[i] >= '0' && s[i] <= '9') {
      if (!hasNumber) {
        offset = offset << 1
        hasNumber = true
      }
    } else {
      if (!hasSpecial) {
        offset = offset << 1
        hasSpecial = true
      }
    }
  }

  return offset >= 8
}
