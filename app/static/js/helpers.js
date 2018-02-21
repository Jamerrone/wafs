export const helpers = {
  // The helpers object is the place to store helper functions!
  getRandomArrayItem (array) {
    // Returns a random array item.
    return array[Math.floor(Math.random() * array.length)]
  }
}
