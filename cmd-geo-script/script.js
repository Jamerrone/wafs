/*
 *   cmdaan.js
 *   Bevat functies voor CMDAan stijl geolocatie welke uitgelegd
 *   zijn tijdens het techniek college in week 5.
 *
 *   Author: J.P. Sturkenboom <j.p.sturkenboom@hva.nl>
 *   Credit: Dive into html5, geo.js, Nicholas C. Zakas
 *
 *   Copyleft 2012, all wrongs reversed.
 */

(function () {
  // Variable declaration
  const SANDBOX = 'SANDBOX'
  const LINEAIR = 'LINEAIR'
  const GPS_AVAILABLE = 'GPS_AVAILABLE'
  const GPS_UNAVAILABLE = 'GPS_UNAVAILABLE'
  const POSITION_UPDATED = 'POSITION_UPDATED'
  const REFRESH_RATE = 1000
  const currentPosition = currentPositionMarker = customDebugging = debugId = map = interval = intervalCounter = updateMap = false
  const locatieRij = markerRij = []

  const APP = {
    // Test of GPS beschikbaar is (via geo.js) en vuur een event af
    init: () => {
      DEBUG.createMessage('Controleer of GPS beschikbaar is...')

      ET.addListener(GPS_AVAILABLE, this.startInterval)
      ET.addListener(GPS_UNAVAILABLE, () => {
        DEBUG.createMessage('GPS is niet beschikbaar.')
      });
      (geo_position_js.init()) ? ET.fire(GPS_AVAILABLE): ET.fire(GPS_UNAVAILABLE)
    },
    // Start een interval welke op basis van REFRESH_RATE de positie updated
    startInterval: (event) => {
      DEBUG.createMessage('GPS is beschikbaar, vraag positie.')
      POSITION.update()
      interval = self.setInterval(POSITION.update(), REFRESH_RATE)
      ET.addListener(POSITION_UPDATED, _check_locations)
    }
  }

  const POSITION = {
    // Callback functie voor het instellen van de huidige positie, vuurt een event af
    set: (position) => {
      currentPosition = position
      ET.fire('POSITION_UPDATED')
      DEBUG.createMessage(intervalCounter + ' positie lat:' + position.coords.latitude + ' long:' + position.coords.longitude)
    },
    // Controleer de locaties en verwijs naar een andere pagina als we op een locatie zijn
    check: () => {
      // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
      for (let i = 0; i < locaties.length; i++) {
        let locatie = {
          coords: {
            latitude: locaties[i][3],
            longitude: locaties[i][4]
          }
        }

        if (_calculate_distance(locatie, currentPosition) < locaties[i][2]) {
          // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
          if (window.location !== locaties[i][1] && localStorage[locaties[i][0]] === 'false') {
            // Probeer local storage, als die bestaat incrementeer de locatie
            try {
              (localStorage[locaties[i][0]] === 'false') ? localStorage[locaties[i][0]] = 1: localStorage[locaties[i][0]]++
            } catch (error) {
              DEBUG.createMessage('Localstorage kan niet aangesproken worden: ' + error)
            }

            // TODO: Animeer de betreffende marker

            window.location = locaties[i][1]
            DEBUG.createMessage('Speler is binnen een straal van ' + locaties[i][2] + ' meter van ' + locaties[i][0])
          }
        }
      }
    },
    // Vraag de huidige positie aan geo.js, stel een callback in voor het resultaat
    update: () => {
      intervalCounter++
      geo_position_js.getCurrentPosition(this.set, DEBUG.errorHandler, {
        enableHighAccuracy: true
      })
    },
    // Bereken het verchil in meters tussen twee punten
    getDistance: (p1, p2) => {
      let pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude)
      let pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude)
      return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0)
    }
  }

  // GOOGLE MAPS FUNCTIES
  /**
   * generate_map(myOptions, canvasId)
   *  roept op basis van meegegeven opties de google maps API aan
   *  om een kaart te genereren en plaatst deze in het HTML element
   *  wat aangeduid wordt door het meegegeven id.
   *
   *  @param myOptions:object - een object met in te stellen opties
   *      voor de aanroep van de google maps API, kijk voor een over-
   *      zicht van mogelijke opties op http://
   *  @param canvasID:string - het id van het HTML element waar de
   *      kaart in ge-rendered moet worden, <div> of <canvas>
   */
  const GMAP = {
    generate: (myOptions, canvasId) => {
      // TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
      DEBUG.createMessage('Genereer een Google Maps kaart en toon deze in #' + canvasId)
      map = new google.maps.Map(document.getElementById(canvasId), myOptions)

      let routeList = []
      // Voeg de markers toe aan de map afhankelijk van het tourtype
      DEBUG.createMessage('Locaties intekenen, tourtype is: ' + tourType)
      for (let i = 0; i < locaties.length; i++) {

        // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
        try {
          (localStorage.visited === undefined || HELPER.isNumber(localStorage.visited)) ? localStorage[locaties[i][0]] = false : null
        } catch (error) {
          DEBUG.createMessage('Localstorage kan niet aangesproken worden: ' + error)
        }

        let markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4])
        routeList.push(markerLatLng)

        let markerRij = {}
        for (let attr in locatieMarker) {
          markerRij[i][attr] = locatieMarker[attr]
        }
        markerRij[i].scale = locaties[i][2] / 3

        let marker = new google.maps.Marker({
          position: markerLatLng,
          map: map,
          icon: markerRij[i],
          title: locaties[i][0]
        })
      }
      // TODO: Kleur aanpassen op het huidige punt van de tour
      if (tourType === LINEAIR) {
        // Trek lijnen tussen de punten
        DEBUG.createMessage('Route intekenen')
        let route = new google.maps.Polyline({
          clickable: false,
          map: map,
          path: routeList,
          strokeColor: 'Black',
          strokeOpacity: .6,
          strokeWeight: 3
        })
      }

      // Voeg de locatie van de persoon door
      currentPositionMarker = new google.maps.Marker({
        position: kaartOpties.center,
        map: map,
        icon: positieMarker,
        title: 'U bevindt zich hier'
      })

      // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
      ET.addListener(POSITION_UPDATED, this.update)
    },
    update: () => {
      var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude)
      map.setCenter(newPos)
      currentPositionMarker.setPosition(newPos)
    }
  }

  const HELPER = {
    isNumber: (n) => !isNaN(parseFloat(n)) && isFinite(n)
  }

  const DEBUG = {
    createMessage: (message) => {
      (customDebugging && debugId) ? document.getElementById(debugId).innerHTML: console.log(message)
    },
    errorHandler: (code, message) => this.createMessage('geo.js error ' + code + ': ' + message),
    customDebugging: (debugId) => {
      debugId = this.debugId
      customDebugging = true
    }
  }

  APP.init()
})()
