function earthquakesInLastHour() {
  var url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
  $.get(url, function(data) {
    for (i=0; i < data.features.length; i++){
      $("#eq-last-hour").append("<br>Magnitude " + data.features[i].properties.mag + " located " + data.features[i].properties.place + "." + "<br>");
    }
  });
}

earthquakesInLastHour();
