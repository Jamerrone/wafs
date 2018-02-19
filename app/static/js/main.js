/* global routie, Transparency, XMLHttpRequest */
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

  const routes = {
    // The routes object is mostly used to catch multiple urls and request
    // the required API data.
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
          // This may look complex, however, all this code does is capitalize
          // every first letter from every word inside the name string.
          document.title = `Dog Emporium - ${name.replace(/\b[a-z]/g, function (
            f
          ) {
            return f.toUpperCase()
          })}`
          sections.toggle('#detail')
        },
        '*': () => {
          // Catch every other URL path and redirect the user to #home.
          window.location.hash = '#home'
        }
      })
    }
  }

  const template = {
    // The template object is used to render the right information/screen
    // based on the type of information passed by the API.
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
    data: {
      facts: [
        '"In general, smaller breeds live longer than larger breeds."',
        '"In Croatia, scientists discovered that lampposts were falling down because a chemical in the urine of male dogs was rotting the metal."',
        '"Dog nose prints are as unique as human finger prints and can be used to identify them."',
        '"Some Search and Rescue (SaR) Dogs are trained to sniff out humans 1/4 mile away or more."',
        '"George Washington had 36 dogs–all Foxhounds–with one named Sweetlips."',
        '"France has the 2nd highest dog population."',
        '"Max, Jake, Maggie and Molly are the most popular dog names."',
        '"Dogs are naturally submissive to any creature with higher pack status, human or canine."',
        '"The longer a dog’s nose, the more effective it’s internal cooling system."',
        '"A dog\'s sense of smell is 10,000 times stronger than a human\'s."',
        '"Seventy percent of people sign their pet’s name on greeting and holiday cards."',
        '"A dog’s sense of smell is more than 100,000 times stronger than that of a human."',
        '"Did you hear that? Sound frequency is measured in Hertz (Hz). The higher the Hertz, the higher-pitched the sound. Dogs hear best at 8,000 Hz, while humans hear best at around 2,000 Hz."',
        '"The first dog chapel was established in 2001. It was built in St. Johnsbury, Vermont, by Stephan Huneck, a children’s book author whose five dogs helped him recuperate from a serious illness."',
        '"A dog\'s average body temperature is 101.2 degrees."',
        '"Seeing eye dogs pee and poo on command so that their owners can clean up after them. (The command is usually "Get busy!" and pups will pace back and forth until they do their business.) Male dogs are also trained to do their business without lifting their leg."',
        '"This dog, Naki\'o, lost all of his legs to frostbite in Colorado, but now has four prosthetic legs and can run around like normal."',
        '"The largest dog was an English Mastiff who weighed 343 pounds."',
        '"Average body temperature for a dog is 101.2 degrees."',
        '"Dogs don\'t enjoy being hugged as much as humans and other primates. Canines interpret putting a limb over another animal as a sign of dominance."'
      ]
    },
    request (url, type, caller, breedName) {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', `${url}`, true)
        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            let result = JSON.parse(request.responseText)
            if (caller === 'fetchAllBreeds') {
              this.data.allBreeds = result.message
            } else if (caller === 'fetchBreedDetails') {
              console.log(result)
              this.data[breedName] = result.message
            }
            console.log(this.data)
            if (type === 'list') result = this.formatData(result)
            if (type === 'detail') result = result.message
            resolve(template.render(result, type))
          } else {
            console.log(
              'We reached our target server, but it returned an error.'
            )
          }
        }
        request.onerror = () => reject(request.statusText)
        request.send()
      }).catch(() => {
        window.location.href = '#breeds'
        document.querySelector('.error-message').style.display = 'block'
        setTimeout(() => {
          document.querySelector('.error-message').style.display = 'none'
        }, 10000)
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
    // The only thing the navigation object can accomplish at its current
    // state is toggle the active href, this is purely visual. In the future, this
    // object could be updated with more advanced functionality.
    toggle (route) {
      // Hide the active state from every nav link.
      document.querySelectorAll('nav li a').forEach(section => {
        section.classList.remove('active')
      })
      // Show the active state on the current href.
      document
        .querySelector(`a[href="${route}"], a[href="#breeds"]`)
        .classList.add('active')
    }
  }

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
      // Show a section based on the current URL/path.
      document.querySelector(route).classList.add('visible')
      navigation.toggle(route)
    }
  }

  const helpers = {
    // The helpers object is the place to store helper functions!
    getRandomArrayItem (array) {
      // Returns a random array item.
      return array[Math.floor(Math.random() * array.length)]
    }
  }
  // Initialise the web application.
  app.init()
}
