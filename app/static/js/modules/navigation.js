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

export default navigation
