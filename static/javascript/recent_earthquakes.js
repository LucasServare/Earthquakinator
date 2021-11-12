function earthquakesInLastHour(choice) {
  var url;
  switch(choice) {
    case 'hour':
      url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
      break;
    case 'day':
      url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
      break;
    case 'week':
      url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
      break;
  }
  $.get(url, function(data) {
    $('#eq-last').empty();
    for (i=0; i < data.features.length; i++){
      $("#eq-last").append("<br>Magnitude " + data.features[i].properties.mag + " located " + data.features[i].properties.place + "." + "<br>");
    }
  });
}

$('input[name=time]').change(function() {
  var choice = $('input[name=time]:checked').val()
  earthquakesInLastHour(choice)
})

earthquakesInLastHour('hour');
