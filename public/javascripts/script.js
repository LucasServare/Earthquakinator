var today = moment().format('YYYY[-]MM[-]DD');
var choice = $('input[name=time]:checked').val()

$('input[name=time]').change(function() {
  choice = $('input[name=time]:checked').val()
  if (choice == 'custom') {
    $('#custom-choice').fadeIn(350);
    return;
  }
  $('#custom-choice').hide()
});

//On user request, perform an api call and get earthquake data.
$("#button").click(function() {
  disableButton();
  end_date = today;
  switch(choice) {
    case 'oneweek':
      start_date = moment().subtract(7, 'days').format('YYYY[-]MM[-]DD');
      break;
    case 'onemonth':
      start_date = moment().subtract(30, 'days').format('YYYY[-]MM[-]DD');
      break;
    case 'twomonths':
      start_date = moment().subtract(60, 'days').format('YYYY[-]MM[-]DD');
      break;
    case 'custom':
      start_date = $("#start_date").val();
      end_date = $("#end_date").val();
    break;
  }
  if (Math.abs((new Date(start_date) - new Date(end_date)) / (1000 * 60 * 60 * 24)) < 61) {
        getEarthquakeData();
      }
    else {
      if (confirm("Are you sure? This is a lot of data to ask for. It may take a while to get it, and it will be taxing to the poor server api.")) {
      getEarthquakeData();
      }
      else {
        alert("Good call. I'm sure they'll appreciate it.");
        enableButton();
      }
    }
});

function getEarthquakeData() {
  var url = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
  url += '&starttime='+ start_date + '&endtime=' + end_date;
  $.get(url, function(data) {
  //Change earthquake count.
  $("#eq_count").html(data.features.length);
  createDict(data);
  largestEarthquake(data);
  //Add all magnitudes to an array, and begin calculating the average magnitude.
  magnitude_sum = 0;

  for (i=0; i < data.features.length; i++) {
  magnitude_sum += data.features[i].properties.mag;
  $("#eq_mag_avg").html(Math.round((magnitude_sum/data.features.length)));
  }
  createDatamap(data);
  });
}

function disableButton() {
  $('#button').html('Retrieving...');
  $('#button').prop('disabled', true);
}

function enableButton() {
  $('#button').html('Submit');
  $('#button').prop('disabled', false);
}

//Loop through a given array and count the number of times each element in the array appears.

function createDict(arr) {
	magnitudes_array = [];
	for (i = 0; i < arr.features.length; i++) {
		magnitudes_array.push(arr.features[i].properties.mag);
	}
	//Run through magnitudes_array and round it to the nearest tenth.
	for (i = 0; i < magnitudes_array.length; i++) {
		magnitudes_array[i] = Math.round(magnitudes_array[i] * 10)/10
	}
	distinctValuesCount(magnitudes_array);
}


function distinctValuesCount(arr) {
	count_array = [];
	arr.sort();
	for (i = 0; i < arr.length; i++) {
	current_num = arr[i];
	count = 0;
		for (j = 0; j < arr.length; j++) {
			 if (current_num === arr[j]) {
				 count++;
		 	 }
		 }
		 already_exists = false;
	 for (l = 0; l < count_array.length; l++) {
		 if (count_array[l][0] === current_num) {
			 already_exists = true;
		 }
	 }
		 if (already_exists == false) {
			 count_array.push([current_num, count]);
		 }
	 }

magnitudes_x = [];
magnitudes_y = [];

 	for (i = 0; i < count_array.length; i++) {
	 	magnitudes_x.push(count_array[i][0]);
	 	magnitudes_y.push(count_array[i][1]);
	}

magnitudes_x.unshift('x');
magnitudes_y.unshift('Occurences');

	//Graph pretty things!
	var chart = c3.generate({
		tooltip: {
			format: {
				title: function (d) {return 'Magnitude: ' + d }
			}
		},
		data: {
			x: 'x',
				columns: [
				magnitudes_x,
				magnitudes_y
				],
			type: 'bar'
		},
		axis: {
        x: {
          label: {
            text: 'Magnitude',
			  		position: 'outer-center'
          }
        },
				y: {
					label: {
						text: 'Occurences',
						position: 'outer-middle'
					}
				}
		}
	});
  //Here because we only want to re-enable button AFTER graph renders.
  enableButton();
  //Once the graph is loaded, unhide the div with earthquake info..
  $('.earthquakes').show();
}

function largestEarthquake(data) {
  var largest = data.features[0];
  for (i = 0; i < data.features.length; i++) {
    if (data.features[i].properties.mag > largest.properties.mag) {
    largest = data.features[i];
    }
  }
  $("#biggest-mag").html(largest.properties.mag);
  $("#biggest-loc").html(largest.properties.place);
}

//Grab data from external api and add them as objects to an array.

function createDatamap(data) {
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
}

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
