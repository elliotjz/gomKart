
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
  '#3B3EAC'
]

export const getQueryVariable = (variable) => {
  let query = window.location.search.substring(1);
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1])
    }
  }
}

export const comparePos = (a,b) => {
  a = parseInt(a.position)
  b = parseInt(b.position)
  if (a < b)
    return -1;
  if (a > b)
    return 1;
  return 0;
}

export const compareRaces = (a,b) => {
  a = a.date
  b = b.date
  if (a > b)
    return -1;
  if (a < b)
    return 1;
  return 0;
}

export const comparePlayerScores = (a,b) => {
  return b[1] - a[1]
}
