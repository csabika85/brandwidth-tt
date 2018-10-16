//Global variables/ arrays
var events = [];
var startDates = [];
var finishDates = [];
var dateFilter = false;

var startFilter = "";
var finishFilter = "";

//Getting data from API and storing events in events array
$.get("https://my-json-server.typicode.com/brandwidth/brandwidth-test-case-db/events", function(data){
    $.each(data, function(key,value) {
        var title = value.title;
        var type = value.type;
        var start = new Date(value.date_start);
        var start = Date.parse(value.date_start);
        var month_start = start.getMonth() + 1;
        var start = start.getFullYear()+ "/" + month_start + "/" + start.getDate();
        var finish = Date.parse(value.date_finish);
        var month_finish = finish.getMonth() + 1;
        var finish = finish.getFullYear()+ "/" + month_finish + "/" + finish.getDate();
        var description = value.description;
        var long = value.long;
        var lat = value.lat;

        events.push({title: title, type: type, start: start, finish: finish, description: description, lng: long, lat: lat});
        var start = new Date(start)
        var finish = new Date(finish)


        startDates.push(start);
        finishDates.push(finish);
    });

    initMap();
    minMaxDate();
});

// Initialize and add the map
function initMap(eventType) {
  var eventType = eventType;
  // The location of England for default map view
  var england = {lat: 51.5965, lng: -1.8587};
  // The map, centered at England
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 7, center: england});

    $.each(events, function(key,value) {
      var title = value.title;
      var location = {lat: value.lat, lng: value.lng};
      var type = value.type;
      var start_date = value.start;
      var finish_date = value.finish;
      var description = value.description;

      var contentString = '<div id="content">'+
                  '<h3>' + title + '</h3>'+
                  '<p>' + type + '</p>'+
                  '<p>' + description + '</p>'+
                  '<p> Date: <br><br>' + start_date + ' - ' + finish_date + '</p>'+
                  '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 300
      });

      //Setting up icons for different event categories
      if (type == "Sports") {
        var label = '<span class="map-icon map-icon-stadium"></span>';
        var color = '#3393FF';
      } else if (type == "Music") {
        var label = '<span class="map-icon map-icon-night-club"></span>';
        var color = '#FF5733';
      } else if (type == "Entertainment") {
        var label = '<span class="map-icon map-icon-amusement-park"></span>';
        var color = '#17A873';
      }

      if ((eventType == undefined || eventType == "all") && dateFilter == false) {
        var marker = new mapIcons.Marker({
            position: location,
            map: map,
            title: title,
            icon: {
              path: mapIcons.shapes.SQUARE_PIN,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#00CCBB',
              strokeWeight: 0
            },
            map_icon_label: label
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
      } else if (eventType == type && dateFilter == false) {
        var marker = new mapIcons.Marker({
            position: location,
            map: map,
            title: title,
            icon: {
              path: mapIcons.shapes.SQUARE_PIN,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#00CCBB',
              strokeWeight: 0
            },
            map_icon_label: label
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
      }
      if (dateFilter == true) {
        var fromDate = new Date(startFilter);
        var toDate =  new Date(finishFilter);
        if (fromDate < new Date(start_date)  && new Date(finish_date) < toDate ){
          var marker = new mapIcons.Marker({
              position: location,
              map: map,
              title: title,
              icon: {
                path: mapIcons.shapes.SQUARE_PIN,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#00CCBB',
                strokeWeight: 0
              },
              map_icon_label: label
            });
            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });
        }
      }
      })
}

//Filter by event/ date switch
function filterBy(cb) {
  if (cb.value == "date") {
    $("#filter-type").hide();
    $("#filter-date").show();
  } else if (cb.value = "type") {
    $("#filter-type").show();
    $("#filter-date").hide();
  }
}

//Filter events by type
$('select').on('change', function() {
  var eventType = this.value;
  dateFilter = false;
  initMap(eventType);
});

//Determining min and max date based on earliest and latest event dates coming from the api

function minMaxDate() {
  //Getting earliest and latest start dates
  var maxStartDate=new Date(Math.max.apply(null,startDates));
  var month = maxStartDate.getMonth() + 1;
  maxStartDate = maxStartDate.getFullYear()+ ", " + month + ", " + maxStartDate.getDate();

  var minStartDate = new Date(Math.min.apply(null,startDates));
  var month = minStartDate.getMonth() + 1;
  minStartDate = minStartDate.getFullYear()+ ", " + month + ", " + minStartDate.getDate();

  //Getting earliest and latest finish dates
  var maxFinishDate=new Date(Math.max.apply(null,finishDates));
  var month = maxFinishDate.getMonth() + 1;
  maxFinishDate = maxFinishDate.getFullYear()+ ", " + month + ", " + maxFinishDate.getDate();

  var minFinishDate = new Date(Math.min.apply(null,finishDates));
  var month = minFinishDate.getMonth() + 1;
  minFinishDate = minFinishDate.getFullYear()+ ", " + month + ", " + minFinishDate.getDate();
  initDatePicker(minStartDate, maxStartDate, minFinishDate, maxFinishDate);
}

//Apply datepicker with min date and max dates

function initDatePicker(minStartDate, maxStartDate, minFinishDate, maxFinishDate) {
  $( ".datepicker-from" ).datepicker({
    minDate: Date.parse(minStartDate),
    maxDate: Date.parse(maxStartDate)
  });

  $( ".datepicker-to" ).datepicker({
    minDate: Date.parse(minFinishDate),
    maxDate: Date.parse(maxFinishDate)
  });
}

function filterDates(start, finish) {
  startFilter = start;
  finishFilter = finish;
  dateFilter = true;
  initMap();
}
