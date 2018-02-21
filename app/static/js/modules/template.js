const template = {
  // The template object is used to render the right information/screen
  // based on the type of information passed by the API.
  render (data, type) {
    if (type === 'list') {
      const directives = {
        // Fill every href with its own URL.
        dogBreed: {
          href: function () {
            return `#breeds/${this.dogBreed}`
          }
        }
      }
      // Render the page.
      Transparency.render(
        document.querySelector('#dog-breeds'),
        data,
        directives
      )
    } else if (type === 'detail') {
      // Fill every image src with its own URL.
      const directives = {
        detailPicture: {
          src: function () {
            return `${this.value}`
          }
        }
      }
      // Render the page.
      Transparency.render(
        document.querySelector('#dog-detail'),
        data,
        directives
      )
    }
  }
}

export default template
