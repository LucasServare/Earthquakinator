function earthquakesInLastHour(choice) {
  var url;

  switch(choice) {
    case 'hour':
      url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
      break;
    case 'day':
      url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
      break;
    case 'week':
      url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
      break;
  }

  $.get(url, function(data) {
    for (i=0; i < data.features.length; i++){
      $("#eq-last-hour").append("<br>Magnitude " + data.features[i].properties.mag + " located " + data.features[i].properties.place + "." + "<br>");
    }
  });
}

$('#selector').change(function() {
  var choice = $('#selector').val();
  $("#type").html(choice);
  earthquakesInLastHour(choice)
});

earthquakesInLastHour('hour');
