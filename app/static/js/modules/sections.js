import navigation from './navigation.js'
import helpers from './helpers.js'

const sections = {
  // Very similar to the navigation object, right now the sections object
  // can only hide or show the required sections.
  hideAll () {
    // Hide every section.
    document.querySelectorAll('section').forEach(section => {
      section.classList.remove('visible')
    })
  },
  toggle (route) {
    this.hideAll()
    // Make sure the website is always scrolled to the top before rendering
    // a new page.
    window.scrollTo(0, 0)
    // Make sure the first 30 images are loaded before hiding the loader.
    document
      .querySelector('img:nth-of-type(30), *')
      .addEventListener('load', () => {
        helpers.loader.hide()
      })
    // Show a section based on the current URL/path.
    document.querySelector(route).classList.add('visible')
    navigation.toggle(route)
  }
}

export default sections
