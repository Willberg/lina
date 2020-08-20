export const isValidUsername = (str: string) => /^[a-zA-Z0-9]{8,}$/.test(str.trim())
export const isValidEmail = (str: string) => /^[a-zA-Z0-9]+\_*[a-zA-Z0-9]*@[a-z0-9]+\.[a-z]+$/.test(str.trim())
export const isValidPhoneNumber = (str: string) => /^[0-9]{11}$/.test(str.trim())
export const isValidLoginUser = (str: string) => isValidUsername(str.trim()) || isValidEmail(str.trim()) || isValidPhoneNumber(str.trim())
