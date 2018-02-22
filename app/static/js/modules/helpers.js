const helpers = {
  // The helpers object is the place to store helper functions!
  getRandomArrayItem (array) {
    // Returns a random array item.
    return array[Math.floor(Math.random() * array.length)]
  },
  capitalizeFirstLetters (string) {
    // This may look complex, however, all this code does is capitalize
    // every first letter from every word inside the name string.
    return string.replace(/\b[a-z]/g, function (f) {
      return f.toUpperCase()
    })
  },
  loader: {
    // Show or Hide the loading splash screen.
    show () {
      document.querySelector('#loader').classList.add('visible')
    },
    hide () {
      // A very small delay in order to give the image rendering more time.
      // setTimeout(() => {
      document.querySelector('#loader').classList.remove('visible')
      // }, 500)
    }
  }
}

export default helpers
