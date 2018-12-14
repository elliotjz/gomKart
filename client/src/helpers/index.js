export const colors = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#DD4477',
  '#3B3EAC',
  '#0099C6',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#DD4477',
  '#3B3EAC',
  '#0099C6',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
]

export const getQueryVariable = variable => {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1])
    }
  }
}

export const comparePos = (a, b) => {
  const aPos = parseInt(a.position)
  const bPos = parseInt(b.position)
  if (aPos < bPos) return -1
  if (aPos > bPos) return 1
  return 0
}

export const compareRaces = (a, b) => {
  const aDate = a.date
  const bDate = b.date
  if (aDate > bDate) return -1
  if (aDate < bDate) return 1
  return 0
}

export const comparePlayerScores = (a, b) => b[1] - a[1]

export const nameVerification = (name, playerScores) => {
  // Check that the name starts with a character
  let errorMessage = ''

  // verify length
  if (name.length > 16)
    errorMessage = "Name can't be more than 16 characters long."

  // verify characters
  if (name.match(/^[-'0-9a-zÀ-ʯ\s]+$/i) === null)
    errorMessage = 'Name must only contain letters and numbers'

  // verify first letter
  const letters = /^[A-Za-zÀ-ʯ]+$/
  if (!name.charAt(0).match(letters))
    errorMessage = 'Name must start with a letter'

  // Check if the name already exists
  const players = playerScores.map(player => player[0])
  if (players.includes(name))
    errorMessage = "There's already a player with this name in the tournament"

  if (errorMessage !== '') {
    return {
      success: false,
      errorMessage,
    }
  }

  return { success: true }
}
