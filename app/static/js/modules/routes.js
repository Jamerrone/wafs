import sections from './sections.js'
import api from './api.js'
import helpers from './helpers.js'

const routes = {
  // The routes object is mostly used to catch multiple urls and request
  // the required API data.
  init () {
    routie({
      home () {
        // Home view.
        document.title = 'Dog Emporium - Home'
        sections.toggle(window.location.hash)
      },
      breeds () {
        // List view.
        api.fetchAllBreeds()
        document.title = 'Dog Emporium - Breeds'
        sections.toggle(window.location.hash)
      },
      'breeds/:name' (name) {
        // Detail view.
        api.fetchBreedDetails(name)
        document.title = `Dog Emporium - ${helpers.capitalizeFirstLetters(
          name
        )}`
        sections.toggle('#detail')
      },
      '*': () => {
        // Catch every other URL path and redirect the user to #home.
        window.location.hash = '#home'
      }
    })
  }
}

export default routes
