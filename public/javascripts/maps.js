var map = new Datamap({
    element: document.getElementById('map-container'),
    scope: 'world',
    responsive: true,
    geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false
    },
    fills: {
        defaultFill: '#EDDC4E'
    }
});

var earthquakes = [{
  name: 'Earthquake 1',
  latitude: 0,
  longitude: 50,
  radius: 50,
  magnitude: 10
},{
  name: 'Earthquake 2',
  latitude: 100,
  longitude: 0,
  radius: 50,
  magnitude: 10
},{
  name: 'Earthquake 1',
  latitude: 0,
  longitude: 150,
  radius: 50,
  magnitude: 10
}
];

//draw bubbles for bombs
map.bubbles(earthquakes, {
    popupTemplate: function (data) {
            return ['<div class="hoverinfo">' +  data.name,
            '<br>Magnitude: ' +  data.magnitude +
            '</div>'].join('');
    }
});

$(window).resize(function() {
  map.resize();
});
