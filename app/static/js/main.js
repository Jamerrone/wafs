{
  'use strict'
  const app = {
    init() {
      onload = () => {
        location.hash && sections.toggle(location.hash)
      }
      routes.init()
    }
  }

  const routes = {
    init() {
      onhashchange = () => {
        sections.toggle(location.hash)
      }
    }
  }

  const navigation = {
    toggle(href) {
      $('nav a').forEach((a) => {
        a.classList.remove('active')
      })
      $1('nav a[href="' + href + '"]').classList.add('active')
    }
  }

  const sections = {
    toggle(route) {
      $('section').forEach((section) => {
        section.classList.remove('visible')
      })
      $1(route).classList.add('visible')
      navigation.toggle(route)
    }
  }

  function $1(selector) {
    return document.querySelector(selector);
  }

  function $(selector) {
    return document.querySelectorAll(selector);
  }

  app.init()
}