const API_URL = 'https://api.test.com'\n\nexport function getUserUrl(id: number): string {
  return `${API_URL}/users/${id}`
}