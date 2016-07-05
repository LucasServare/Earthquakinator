//Grab data from external api and add them as objects to an array.

url = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2000-01-01&endtime=2000-05-01'

$.get(url, function(data) {
  eqObjects = [];
  for (i=0; i < data.features.length; i++) {
    if (data.features[i].properties.mag != null) {
      eqObjects.push({name: data.features[i].properties.place, mag: data.features[i].properties.mag, longitude: data.features[i].geometry.coordinates[0],
      latitude: data.features[i].geometry.coordinates[1]});
    }
  }

  //Sort that array of objects by magnitude - largest first.
  eqObjects.sort(function (a, b) {
   if (a.mag < b.mag) {
      return 1;
  }
  if (a.mag > b.mag) {
      return -1;
  }
    return 0;
  });
  drawDatamap();
});

function drawDatamap() {

  var map = new Datamap({
      element: document.getElementById('map-container'),
      scope: 'world',
      responsive: true,
      geographyConfig: {
          popupOnHover: false,
          highlightOnHover: false
      },
      fills: {
          'earthquakes': '#996633',
          defaultFill: '#98e698'
      }
  });

  var earthquakes = [{
    name: eqObjects[0].name,
    latitude: eqObjects[0].latitude,
    longitude: eqObjects[0].longitude,
    radius: Math.pow(eqObjects[0].mag/5, 5) * 5,
    magnitude: eqObjects[0].mag,
    fillKey: 'earthquakes'
  },{
    name: eqObjects[1].name,
    latitude: eqObjects[1].latitude,
    longitude: eqObjects[1].longitude,
    radius: Math.pow(eqObjects[1].mag/5, 5) * 5,
    magnitude: eqObjects[1].mag,
    fillKey: 'earthquakes'
  },{
    name: eqObjects[2].name,
    latitude: eqObjects[2].latitude,
    longitude: eqObjects[2].longitude,
    radius: Math.pow(eqObjects[2].mag/5, 5) * 5,
    magnitude: eqObjects[2].mag,
    fillKey: 'earthquakes'
  },{
    name: eqObjects[3].name,
    latitude: eqObjects[3].latitude,
    longitude: eqObjects[3].longitude,
    radius: Math.pow(eqObjects[3].mag/5, 5) * 5,
    magnitude: eqObjects[3].mag,
    fillKey: 'earthquakes'
  },{
    name: eqObjects[4].name,
    latitude: eqObjects[4].latitude,
    longitude: eqObjects[4].longitude,
    radius: Math.pow(eqObjects[4].mag/5, 5) * 5,
    magnitude: eqObjects[4].mag,
    fillKey: 'earthquakes'
  },{
  name: eqObjects[5].name,
  latitude: eqObjects[5].latitude,
  longitude: eqObjects[5].longitude,
  radius: Math.pow(eqObjects[5].mag/5, 5) * 5,
  magnitude: eqObjects[5].mag,
  fillKey: 'earthquakes'
},{
  name: eqObjects[6].name,
  latitude: eqObjects[6].latitude,
  longitude: eqObjects[6].longitude,
  radius: Math.pow(eqObjects[6].mag/5, 5) * 5,
  magnitude: eqObjects[6].mag,
  fillKey: 'earthquakes'
},{
  name: eqObjects[7].name,
  latitude: eqObjects[7].latitude,
  longitude: eqObjects[7].longitude,
  radius: Math.pow(eqObjects[7].mag/5, 5) * 5,
  magnitude: eqObjects[7].mag,
  fillKey: 'earthquakes'
},{
  name: eqObjects[8].name,
  latitude: eqObjects[8].latitude,
  longitude: eqObjects[8].longitude,
  radius: Math.pow(eqObjects[8].mag/5, 5) * 5,
  magnitude: eqObjects[8].mag,
  fillKey: 'earthquakes'
},{
  name: eqObjects[9].name,
  latitude: eqObjects[9].latitude,
  longitude: eqObjects[9].longitude,
  radius: Math.pow(eqObjects[9].mag/5, 5) * 5,
  magnitude: eqObjects[9].mag,
  fillKey: 'earthquakes'
}];

  //Draw earthquakes on map
  map.bubbles(earthquakes, {
      popupTemplate: function (data) {
              return ['<div class="hoverinfo">' +  data.name,
              '<br>Magnitude: ' +  data.magnitude,
              '<br>Latitude:' + data.latitude,
              '<br>Longitude:' + data.longitude +
              '</div>'].join('');
      }
  });
}


//Makde the map responsive by resizing it whenever the window is resized.
$(window).resize(function() {
  map.resize();
});
