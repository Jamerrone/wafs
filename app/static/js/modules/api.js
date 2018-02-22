/* global XMLHttpRequest */
import template from './template.js'
import helpers from './helpers.js'
import data from './data.js'

const api = {
  // The API object is used to request data and store data in the
  // computer memory.
  data: {
    // Array full of random dog facts. (Check data.js)
    facts: data.dogFacts
  },
  request (url, type, caller, breedName) {
    // This method is used to request data from the API, however, it will
    // need quite a few parameters. DO NOT CALL THIS METHODE ON ITS OWN.
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', `${url}`, true)
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let result = JSON.parse(request.responseText)
          if (caller === 'fetchAllBreeds') {
            this.data.allBreeds = result.message
          } else if (caller === 'fetchBreedDetails') {
            this.data[breedName] = result.message
          }
          if (type === 'list') result = this.formatData(result)
          if (type === 'detail') result = result.message
          resolve(template.render(result, type))
        } else {
          console.log('We reached our target server, but it returned an error.')
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
    // Formats the API raw data into useable, simpler data. Especially
    // needed for transparency.
    //
    // FROM:
    // {
    //   'beagle': [],
    //   'bulldog': ['french', 'boston']
    // }
    //
    // TO:
    // [
    //  'beagle',
    //  'bulldog (french)',
    //  'bulldog (boston)',
    // ]
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
    // Load or Request data from all dogs. ('List View')
    helpers.loader.show()
    if (this.data.allBreeds) {
      template.render(this.formatData(this.data.allBreeds), 'list')
    } else {
      return this.request(
        'https://dog.ceo/api/breeds/list/all',
        'list',
        'fetchAllBreeds'
      )
    }
  },
  fetchBreedDetails (breedName) {
    // Load or Request data from a single dog. ('Detail View')
    const formatedBreedName = breedName.replace(' ', '/').replace(/\(|\)/g, '')
    helpers.loader.show()
    if (this.data[formatedBreedName]) {
      template.render(this.data[formatedBreedName], 'detail')
    } else {
      return this.request(
        `https://dog.ceo/api/breed/${formatedBreedName}/images`,
        'detail',
        'fetchBreedDetails',
        formatedBreedName
      )
    }
  }
}

export default api
