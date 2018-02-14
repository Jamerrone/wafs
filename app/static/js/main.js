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
      // Compares input on keyup to every list item. In case they don't match hide them.
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

  const routes = {
    // Extremely simple routing object.
    init () {
      routie({
        home: () => {
          document.title = 'Dog Emporium - Home'
          sections.toggle(window.location.hash)
        },
        breeds: () => {
          api.allBreeds()
          document.title = 'Dog Emporium - Breeds'
          sections.toggle(window.location.hash)
        },
        'breeds/:name': name => {
          api.allBreedPictures(name)
          // WHYYYY Give me a .title function please!
          document.title = `Dog Emporium - ${name.replace(/\b[a-z]/g, function (
            f
          ) {
            return f.toUpperCase()
          })}`
          sections.toggle('#detail')
        },
        '*': () => {
          window.location.hash = '#home'
        }
      })
    }
  }

  const template = {
    render (data, type) {
      if (type === 'list') {
        // Formats the given data into usable transparency data.
        const breeds = Object.keys(data.message).reduce((arr, key) => {
          if (data.message[key].length) {
            data.message[key].forEach(item => {
              arr.push({ dogBreed: `${key} (${item})` })
            })
          } else {
            arr.push({ dogBreed: key })
          }
          return arr
        }, [])
        const directives = {
          dogBreed: {
            href: function () {
              return `#breeds/${this.dogBreed}` // Fil in the href attribute.
            }
          }
        }
        Transparency.render(
          // Render List Page with dog breeds.
          document.querySelector('#dog-breeds'),
          breeds,
          directives
        )
      } else if (type === 'detail') {
        const pictures = data.message
        const directives = {
          detailPicture: {
            src: function () {
              return `${this.value}` // Fil in the src attribute.
            }
          }
        }
        Transparency.render(
          // Render Detail Page with pictures.
          document.querySelector('#dog-detail'),
          pictures,
          directives
        )
      }
    }
  }

  const api = {
    request (url, type) {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', `${url}`, true) // Request URL.
        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            // If success, renders template.
            const data = JSON.parse(request.responseText)
            resolve(template.render(data, type))
          } else {
            // Else console.log().
            console.log(
              'We reached our target server, but it returned an error.'
            )
          }
        }
        request.onerror = () => reject(console.log(request.statusText))
        request.send()
      })
    },
    allBreeds () {
      this.request('https://dog.ceo/api/breeds/list/all', 'list') // Request API data.
    },
    allBreedPictures (breedName) {
      this.request(
        // Request API data.
        `https://dog.ceo/api/breed/${breedName // Formats the string (breedName) to usable API URL's.
          .replace(' ', '/')
          .replace(/\(|\)/g, '')}/images`,
        'detail'
      )
    }
  }

  const navigation = {
    toggle (route) {
      document.querySelectorAll('nav li a').forEach(section => {
        section.classList.remove('active')
      })
      document.querySelector(`a[href="${route}"]`).classList.add('active')
    }
  }

  const sections = {
    toggle (route) {
      document.querySelectorAll('section').forEach(section => {
        section.classList.remove('visible') // Hide all sections.
      })
      document.querySelector(route).classList.add('visible') // Display a section based on the route/#.
      navigation.toggle(route)
    }
  }
  app.init()
}
