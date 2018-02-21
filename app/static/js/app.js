import routes from './modules/routes.js'
import api from './modules/api.js'
import sections from './modules/sections.js'
import helpers from './modules/helpers.js'

{
  const app = {
    // The app object is mostly used as an application initializer,
    // for example, it will create event listeners and general methods.
    init () {
      if (window.location.hash) sections.toggle(window.location.hash)
      this.getNewFact()
      document
        .querySelector('button')
        .addEventListener('click', this.getNewFact)
      document.querySelector('#search').addEventListener('keyup', this.search)
      routes.init()
    },
    getNewFact () {
      // Replace the current displaying fact with a new random one.
      document.querySelector('#fact').innerHTML = helpers.getRandomArrayItem(
        api.data.facts
      )
    },
    search () {
      // A simple search method that compares the current input value with
      // every single list item.
      const input = document.querySelector('#search')
      const filter = input.value.toUpperCase()
      const ul = document.querySelector('#dog-breeds')
      const li = ul.querySelectorAll('li')

      li.forEach(li => {
        const a = li.getElementsByTagName('a')[0]
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li.style.display = ''
        } else {
          li.style.display = 'none'
        }
      })
    }
  }

  // Initialise the web application.
  app.init()
}
