const helpers = {
  // The helpers object is the place to store helper functions!
  getRandomArrayItem (array) {
    // Returns a random array item.
    return array[Math.floor(Math.random() * array.length)]
  },
  loader: {
    show () {
      document.querySelector('body').style.position = 'fixed'
      document.querySelector('#loader').classList.add('visible')
    },
    hide () {
      document.querySelector('body').style.position = 'static'
      document.querySelector('#loader').classList.remove('visible')
    }
  }
}

export default helpers
