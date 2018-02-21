import template from './template.js'

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
    const formatedBreedName = breedName.replace(' ', '/').replace(/\(|\)/g, '')
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

export default api
