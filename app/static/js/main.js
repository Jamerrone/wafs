/* global routie, Transparency, XMLHttpRequest */
{
  const app = {
    init () {
      window.onload = () => {
        if (window.location.hash) sections.toggle(window.location.hash)
        document.querySelector('#search').addEventListener('keyup', this.search)
        routes.init()
      }
    },
    search () {
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
    init () {
      routie({
        home () {
          document.title = 'Dog Emporium - Home'
          sections.toggle(window.location.hash)
        },
        breeds () {
          api.fetchAllBreeds()
          document.title = 'Dog Emporium - Breeds'
          sections.toggle(window.location.hash)
        },
        'breeds/:name' (name) {
          api.fetchBreedDetails(name)
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
        const directives = {
          dogBreed: {
            href: function () {
              return `#breeds/${this.dogBreed}`
            }
          }
        }
        Transparency.render(
          document.querySelector('#dog-breeds'),
          data,
          directives
        )
      } else if (type === 'detail') {
        const pictures = data
        const directives = {
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
    data: {},
    request (url, type, caller, breedName) {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', `${url}`, true)
        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText)
            if (caller === 'fetchAllBreeds') {
              this.data.allBreeds = data.message
            } else if (caller === 'fetchBreedDetails') {
              console.log(data)
              this.data[breedName] = data.message
            }
            console.log(this.data)
            if (type === 'list') data = this.formatData(data)
            if (type === 'detail') data = data.message
            resolve(template.render(data, type))
          } else {
            console.log(
              'We reached our target server, but it returned an error.'
            )
          }
        }
        request.onerror = () => reject(console.log(request.statusText))
        request.send()
      })
    },
    formatData (data) {
      data = data.message || data
      return Object.keys(data).reduce((arr, key) => {
        if (data[key].length) {
          data[key].forEach(item => {
            arr.push({ dogBreed: `${key} (${item})` })
          })
        } else {
          arr.push({ dogBreed: key })
        }
        return arr
      }, [])
    },
    fetchAllBreeds () {
      if (this.data.allBreeds) {
        console.log('Loading data...')
        template.render(this.formatData(this.data.allBreeds), 'list')
      } else {
        console.log('Fetching data...')
        return this.request(
          'https://dog.ceo/api/breeds/list/all',
          'list',
          'fetchAllBreeds'
        )
      }
    },
    fetchBreedDetails (breedName) {
      const formatedBreedName = breedName
        .replace(' ', '/')
        .replace(/\(|\)/g, '')
      if (this.data[formatedBreedName]) {
        console.log(`Loading ${formatedBreedName} details...`)
        template.render(this.data[formatedBreedName], 'detail')
      } else {
        console.log(`Fetching ${formatedBreedName} details...`)
        return this.request(
          `https://dog.ceo/api/breed/${formatedBreedName}/images`,
          'detail',
          'fetchBreedDetails',
          formatedBreedName
        )
      }
    }
  }

  const navigation = {
    toggle (route) {
      document.querySelectorAll('nav li a').forEach(section => {
        section.classList.remove('active')
      })
      document
        .querySelector(`a[href="${route}"], a[href="#breeds"]`)
        .classList.add('active')
    }
  }

  const sections = {
    hideAll () {
      document.querySelectorAll('section').forEach(section => {
        section.classList.remove('visible')
      })
    },
    toggle (route) {
      this.hideAll()
      document.querySelector(route).classList.add('visible')
      navigation.toggle(route)
    }
  }
  app.init()
}
