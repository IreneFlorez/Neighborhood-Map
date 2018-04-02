// Global Variables
var map;
//var anchorGPS = {lat: 40.73086864241803, lng: -73.99738311767578};
var anchorGPS = {lat: 59.939832, lng: 30.31456};

var myLocations = [
//   {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
//   {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
//   {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
//   {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
//   {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
//   {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
// ];

  {title: 'Bronze Horseman', location: { lat: 59.936378, lng: 30.30223}, type: 'Museum'},
  {title: 'Saint Isaac\'s Cathedral', location: {lat: 59.933905, lng: 30.306485}, type: 'Museum'},
  {title: 'Church of the Savior on Blood', location: {lat: 59.940100, lng: 30.3289}, type: 'Museum'},
  {title: 'Hermitage Museum', location: {lat: 59.939832, lng: 30.31456}, type: 'Museum'},
  {title: 'Rostral Columns', location: {lat: 59.944682, lng: 30.304971}, type: 'Museum'},
  {title: 'Kazan Cathedral', location: {lat: 59.9341891, lng: 30.3244829}, type: 'Museum'},
  {title: 'Peter and Paul Fortress', location: {lat: 59.9499162, lng: 30.3172042}, type: 'Museum'}
  ];


// setting up viewmodel
function mapViewModel() {
var self = this;
  // knockout observable variable for the input given by a user
  self.searchTerm = ko.observable("");
  // knockout observable array to store location list items
  //this.locationList = ko.observableArray([]);
  // creating a blank array to store locations from the initialList variable
  self.markers = [];
  self.infoWindows = [];
//   self.nytArticleList = [];
    
//   self.getNYTimes = function() {
//         this.nytArticleList([]);
//         var apikey = "16c51504fabd43868ccf75a7028ac754";
//         var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
//         url += '?' + $.param({
//             'api-key': apikey,
//             'q': title, //this.markerTitle
//             //'fq': position,
//             //'sort': "newest"
//         });

//         $.ajax({
//             url: url,
//             method: "GET",
//             dataType: 'jsonp',
//             }).done(function(response) {
//                 console.log(response);
//                 for (var i = 0; i < 5; i++) {
//                     self.nytArticleList().push({
//                         articleTitle: response.response.docs[i].headline.main,
//                         articleUrl: response.response.docs[i].web_url,
//                     });
//                 }
//                 self.displayNYTimes("success");
//             }).fail(function(err) {
//                 throw err;
//                 //self.displayNYTimes("failure");
//             });
//   };

  self.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker=marker;
            var nytkey = '16c51504fabd43868ccf75a7028ac754'
            var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
                              this.marker.Title +
                            '&sort=newest&api-key=' + nytkey;
                $.getJSON(nytimesUrl, function(data){
                    dataType: 'jsonp'
                    var nytArticleList = [];
                    var articles  = data.response.docs;
                    var content = '<p><b>' + marker.getTitle() +
                    '</b></p><ul>';
                    for (var i = 0; i < 5; i++) {
                        content += '<li><a href="' + articles[i].web_url +
                         '" target="_blank">NYT-Article ' +
                          (i + 1) +
                         '</a></li>';
                    }
                    content += '</ul>';
                    infowindow.setContent(content);
                }).fail(function(err) {
                    alert("There was an issue loading the NYT-Article API.");
                });

            infowindow.open(map, marker);
            
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;

            });
        }
    };


    self.populateAndBounceMarker = function() {
        self.infoWindows.forEach(function(infowindow){
            infowindow.close();
        })
        self.populateInfoWindow(this, self.infoWindows[this.id]);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    self.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(anchorGPS),
            zoom: 13,
            //styles: styles
        };

        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        //this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            this.infoWindow = new google.maps.InfoWindow({
                content: myLocations[i].title
            });
            this.markerTitle = myLocations[i].title;
            this.markerLat = myLocations[i].location.lat;
            this.markerLng = myLocations[i].location.lng;
            //this.markerNytArticles = myLocations[i].articleList;
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                //extra: this.markerNytArticles,
                animation: google.maps.Animation.DROP,
                bounce: this.populateAndBounceMarker
            });
            this.marker.setMap(map);
            self.markers.push(this.marker);
            
            self.infoWindows.push(this.infoWindow);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };

    self.initMap();

    // Append locations to a list using data-bind (filter tool)
    self.filteredLocationList = ko.computed(function() {
        var result = [];
        for (var i = 0; i < self.markers.length; i++) {
            var markerLocation = this.markers[i];
            this.name = this.markers[i].title;
            //this.bounce = function(){bounce(this.markers[i].id)};
            markerLocation.bounce = self.markers[i].bounce;
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
    
    function bounce(id){
        self.markers[id].setAnimation(google.maps.Animation.BOUNCE);
    }
 }

errorHandling = function errorHandling() {
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

//activating Knockout
function startApp() {
    ko.applyBindings(new mapViewModel());
}
