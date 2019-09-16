/* global fetch, SunCalc */

const weatherAPIKey = 'dcd19d748f9a4da76524de8ec2bac3f8'

const colors = {
  'night': ['#030102', '#032F5D'],
  'sunrise': ['#032F5D', 'hsla(56, 87%, 73%, 1)', 'hsla(41, 100%, 70%, 1)'],
  'morning': ['hsla(162, 80%, 90%, 1)', 'hsla(56, 87%, 73%, 1)'],
  'afternoon': ['hsla(208, 83%, 67%, 1)', 'hsla(208, 83%, 84%, 1)', 'hsla(208, 83%, 55%, 1)'],
  'golden': ['hsla(208, 83%, 67%, 1)', '#FDC742'],
  'sunset': ['#407598', '#407598', '#AFB3A9', '#FDC742', '#FA4425'],
  'dusk': ['#032F5D', '#053D70', '#6FA2CE']
}

function getCurrentLocation () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (!position) { reject(new Error('no location')) }
      resolve(position.coords)
    })
  })
}

function getWeatherForCoords (coords) {
  console.log({ coords })
  const lat = coords.latitude
  const lon = coords.longitude
  return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${weatherAPIKey}`)
    .then(res => res.json())
}

function getCurrentTimeOfDay (coords) {
  const now = new Date()
  const times = SunCalc.getTimes(now, coords.latitude, coords.longitude)
  console.log({ times })
  if (now < times.sunrise) {
    return 'night'
  }
  if (now < times.sunriseEnd) {
    return 'sunrise'
  }
  if (now < times.solarNoon) {
    return 'morning'
  }
  if (now < times.goldenHour) {
    return 'afternoon'
  }
  if (now < times.sunset) {
    return 'golden'
  }
  if (now < times.dusk) {
    return 'sunset'
  }
  if (now < times.night) {
    return 'dusk'
  }
  return 'night'
}

// getCurrentLocation().then(getWeatherForCoords).then(weather => console.log(weather))
getCurrentLocation()
  .then(coords => getCurrentTimeOfDay(coords))
  .then(timeOfDay => {
    console.log({ timeOfDay })
    const currentColors = colors[timeOfDay]
    const bg = document.getElementById('background')
    bg.style.background = `linear-gradient(${currentColors.join(', ')})`
  })
  .catch(err => {
    console.error(error)
  })
