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

export default routes
