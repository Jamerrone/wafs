/* global routie, Transparency, XMLHttpRequest */
{
  const app = {
    init () {
      window.onload = () => {
        window.location.hash && sections.toggle(window.location.hash) // Single line If Statement.
        document.querySelector('#search').addEventListener('keyup', this.search)
        routes.init()
      }
    },
    search () {
      let input, filter, ul, li, a, i
      input = document.querySelector('#search')
      filter = input.value.toUpperCase()
      ul = document.querySelector('#dog-breeds')
      li = ul.getElementsByTagName('li')

      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName('a')[0]
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = ''
        } else {
          li[i].style.display = 'none'
        }
      }
    }
  }

  const routes = {
    init () {
      routie({
        home: () => {
          sections.toggle(window.location.hash)
        },
        breeds: () => {
          api.allBreeds('get')
          sections.toggle(window.location.hash)
        },
        'breeds/:name': name => {
          api.allBreedPictures('get', name)
          sections.toggle('#detail')
        }
      })
    }
  }

  const template = {
    render (data, type) {
      if (type === 'list') {
        let breeds = []
        let directives = {}
        directives = {
          dogBreed: {
            href: function () {
              return `#breeds/${this.dogBreed}`
            }
          }
        }
        Transparency.render(
          document.querySelector('#dog-breeds'),
          breeds.concat(
            ...Object.entries(data.message).map(([key, value]) =>
              (value.length > 0 ? value : ['']).map(x => ({
                dogBreed: key + (x ? ` (${x})` : '')
              }))
            )
          ),
          directives
        )
      } else if (type === 'detail') {
        let pictures = data.message
        let directives = {}
        directives = {
          detailPicture: {
            src: function () {
              return `${this.value}`
            }
          }
        }
        Transparency.render(
          document.querySelector('#dog-detail'),
          pictures,
          directives
        )
      }
    }
  }

  const api = {
    request (url, type) {
      const request = new XMLHttpRequest()
      request.open('GET', `${url}`, true)

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          const data = JSON.parse(request.responseText)
          template.render(data, type)
        } else {
          console.log('We reached our target server, but it returned an error.')
        }
      }

      request.onerror = () => {
        console.log('There was a connection error.')
      }
      request.send()
    },
    allBreeds (type) {
      if (type === 'get') {
        this.request('https://dog.ceo/api/breeds/list/all', 'list')
      } else {
        console.log('Post')
      }
    },
    allBreedPictures (type, breedName) {
      if (type === 'get') {
        this.request(`https://dog.ceo/api/breed/${breedName}/images`, 'detail')
      } else {
        console.log('Post')
      }
    }
  }

  const sections = {
    toggle (route) {
      document.querySelectorAll('section').forEach(section => {
        section.classList.remove('visible')
      })
      document.querySelector(route).classList.add('visible')
    }
  }
  app.init()
}
