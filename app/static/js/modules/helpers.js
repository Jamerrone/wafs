const helpers = {
  // The helpers object is the place to store helper functions!
  getRandomArrayItem (array) {
    // Returns a random array item.
    return array[Math.floor(Math.random() * array.length)]
  },
  loader: {
    show () {
      document.querySelector('#loader').classList.add('visible')
    },
    hide () {
      setTimeout(() => {
        document.querySelector('#loader').classList.remove('visible')
      }, 500)
    }
  }
}

export default helpers
