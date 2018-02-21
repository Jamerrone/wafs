export const template = {
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
