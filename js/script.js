'use strict';

// // Global Variables
var map, clientID, clientSecret;
var anchorGPS = {lat: 40.7713024, lng: -73.9632393};
var initialLocations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

// setting up viewmodel
function mapViewModel() {
  // assign self to this perimeter
  var self = this;
  // knockout observable variable for the input given by a user
  this.searchTerm = ko.observable("");
  // knockout observable array to store location list items
  this.locationList = ko.observableArray([]);
  // creating a blank array to store markers
  this.markers = [];
  this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            infoWindow.setContent(self.contentString + self.htmlContent)
          }
          this.htmlContent = '<div>' + '<h4 class="iw_title">' + marker.title +
              '</h4>';

          infowindow.open(map, marker);

          infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
          });
        }
  // initialize Loc objects and store them in ko observable array
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: anchorGPS
  });

  initialLocations.forEach(function(locationItem){
    self.locationList.push( new Location(locationItem));
  });

  this.filteredList = ko.computed( function() {
    var filter = self.searchTerm().toLowerCase();
    if (!filter) {
      self.locationList().forEach(function(locationItem){
        locationItem.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        var string = locationItem.name.toLowerCase();
        var result = (string.search(filter) >= 0);
        locationItem.visible(result);
        return result;
      });
    }
  }, self);

  this.mapElem = document.getElementById('map');
  this.mapElem.style.height = window.innerHeight - 50;

var Location = function(data) {
  var self = this;
  this.title = data.title;
  this.lat = data.lat;
  this.long = data.long;
  this.street = "";
  this.city = "";
  this.visible = ko.observable(true);

  this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.title + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city +"</div>";
  this.infoWindow = new google.maps.InfoWindow({content: self.contentString});
  this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.long),
      map: map,
      title: data.title
  });
  this.showMarker = ko.computed(function() {
    if(this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);

  this.marker.addListener('click', function(){
    self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +"</a></div></div>";

    self.infoWindow.setContent(self.contentString);
    self.infoWindow.open(map, this);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          self.marker.setAnimation(null);
      }, 2100);
  });

  this.bounce = function(place) {
    google.maps.event.trigger(self.marker, 'click');
  };
};

this.filteredList = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchTerm()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}


function startApp() {
  ko.applyBindings(new mapViewModel());
}

 
