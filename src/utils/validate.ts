export const isValidUsername = (str: string) => /^[a-zA-Z0-9]{8,}$|^[0-9]{11}$|^[a-zA-Z0-9](\\_*\w)+@[a-z0-9]+\.[a-z]+$/.test(str.trim())
