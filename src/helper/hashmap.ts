const LOOP = 2 ** 16
const COUNTER = 2 ** 4

export const hashmap = (hash: string) => {
  for (let i = 0; i < COUNTER; i++) {
    const name = `hashmap_${i * LOOP}_${(i + 1) * LOOP}.json`
    const data = require('static/hashmap/' + name)
    if (typeof data[hash] === 'number') return data[hash]
  }
  return undefined
}
