export const getRoleFromToken = (token) => {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1])).role
  } catch {
    return null
  }
}
