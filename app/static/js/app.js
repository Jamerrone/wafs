import routes from 'routes.js'
import template from './template.js'
import api from './api.js'
import sections from './sections.js'
import navigation from './navigation.js'
import helpers from './helpers.js'

{
  const app = {
    // The app object is mostly used as an application initializer,
    // for example, it will create event listeners and general
    // functions/methods.
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
      const li = ul.getElementsByTagName('li')

      for (let i = 0; i < li.length; i++) {
        const a = li[i].getElementsByTagName('a')[0]
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = ''
        } else {
          li[i].style.display = 'none'
        }
      }
    }
  }

  // Initialise the web application.
  app.init()
}
