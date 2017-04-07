var today = moment().format('YYYY[-]MM[-]DD');
var timeChoice = $('input[name=time]:checked').val();
var magChoice = Number($('input[name=magnitude]:checked').val());

$('input[name=time]').change(function() {
  timeChoice = $('input[name=time]:checked').val();
  if (timeChoice == 'custom') {
    $('#custom-choice').fadeIn(350);
    return;
  }
  $('#custom-choice').hide();
});

$('input[name=magnitude]').change(function() {
  magChoice = Number($('input[name=magnitude]:checked').val());
});

//On user request, perform an api call and get earthquake data.
$("#button").click(function() {
  $('.flash').html(""); //Reset the flash in case it's been used.
  resetPanels();
  disableButton();
  end_date = today;
  switch(timeChoice) {
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
  var url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
  url += '&starttime='+ start_date + '&endtime=' + end_date + '&minmagnitude=' + magChoice;
  $.get(url, function(data) {
    try {
      //Change earthquake count.
      $("#eq_count").html(data.features.length);
      createDict(data);
      largestEarthquake(data);
      createDatamap(data);
      //Add all magnitudes to an array, and begin calculating the average magnitude.
      magnitude_sum = 0;

      for (i=0; i < data.features.length; i++) {
      magnitude_sum += data.features[i].properties.mag;
      $("#eq_mag_avg").html(Math.round((magnitude_sum/data.features.length)));
      }
      $('#stat-block-1').css('visibility', 'visible').hide().fadeIn(1000);
      $('#stat-block-2').delay(1000).css('visibility', 'visible').hide().fadeIn(1000);
      $('#stat-block-3').delay(2000).css('visibility', 'visible').hide().fadeIn(1000);
  }
  catch(err) {
    if (data.features.length === 0) {
      //Change flash to alert.
      $('.flash').html("<div class='row'>" +
      "<div class='col-xl-6 col-xl-offset-3 text-center center-block'>" +
        "<div class='alert alert-danger alert-dismissible' role='alert'>" +
          "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
          "<strong>No earthquakes were found</strong><br>. Try decreasing the minimum magnitude or increasing the dates surveyed." +
        "</div>" +
      "</div>" +
    "</div>");
    return;
    }
    else {
      console.log(err);
      alert('There was an error. Please try reloading.');
    }
  }});
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
		magnitudes_array[i] = Math.round(magnitudes_array[i] * 10)/10;
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
		 if (already_exists === false) {
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
				title: function (d) {
          return 'Magnitude: ' + d;
        }
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

function createDatamap(data) {
  //Since #map-container starts hidden, its height and width are set to 0. We use this to  set the height and width after the div is shown.
  $('#map-container').height('100%');
  $('#map-container').width('100%');

  eqObjects = [];
  for (i=0; i < data.features.length; i++) {
    if (data.features[i].properties.mag !== null) {
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
//Clear the map if one exists. Prevents creating duplicate maps.
$('#map-container').html('');

  var map = new Datamap({
      element: document.getElementById('map-container'), //tried using Jquery here, didn't work.
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

  var earthquakes = [];
  for (i=0; i < eqObjects.length; i++) {
    earthquakes.push({
      name: eqObjects[i].name,
      latitude: eqObjects[i].latitude,
      longitude: eqObjects[i].longitude,
      radius: Math.pow(eqObjects[i].mag/5, 5) * 10,
      magnitude: eqObjects[i].mag,
      fillKey: 'earthquakes'
    });
  }

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

  //Make the map responsive by resizing it whenever the window is resized.
  $(window).resize(function() {
    map.resize();
  });
}

function resetPanels() {
  $('#stat-block-1').css('visibility', 'hidden');
  $('#stat-block-1').css('visibility', 'hidden');
  $('#stat-block-1').css('visibility', 'hidden');
}
