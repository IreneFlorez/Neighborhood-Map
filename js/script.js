// Global Variables
var map;
var anchorGPS = {lat: 40.73086864241803, lng: -73.99738311767578};
var myLocations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
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

  self.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;


                var location = marker.getLat() + ',' + marker.getLng();
                var nytkey = '16c51504fabd43868ccf75a7028ac754'
                var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + 
                                '&sort=newest&api-key=' +
                                nytkey;
                
                $.getJSON(nytimesUrl, function(data){
                    
                    var articles  = data.response.docs;
                    var content = '<p><b>' + marker.getTitle() +
                    '</b></p><ul>';
                    for (var i = 0; i < articles.length; i++) {
                        content += '<li><a href="' + articles[i].web_url +
                         '" target="_blank">NYT-Article ' +
                          (i + 1) +
                         '</a></li>';
                    }
                    if (!(articles.length)) {
                        content += '<li>No Articles Found</li>';
                    }
                    content += '</ul>';
                    infowindow.setContent(content);
                }).error(function() {
                    alert("There was an issue loading the NYT-Article API.");
                });
                infowindow.open(map, marker);




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

// function loadData() {
//     var $body = $('body');
//     var $wikiElem = $('#wikipedia-links');
//     var $nytHeaderElem = $('#nytimes-header');
//     var $nytElem = $('#nytimes-articles');
//     //var $greeting = $('#greeting');

//     // clear out old data before new request
//     $wikiElem.text("");
//     $nytElem.text("");

//     //var streetStr = $('#street').val();
//     //var cityStr = $('#city').val();
//     var location = marker.lat + ',' + marker.lng;
//     var gmapskey = 'AIzaSyDA6qoUKQ3WJQd4ZxAahhFPM80WJbw-yws';

//     // load streetview
//     var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location + '&heading=151.78&pitch=-0.76&key=' + gmapskey;

//     $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
            
//     // load nytimes
//             var nytkey = '16c51504fabd43868ccf75a7028ac754'
//             var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + 
//                 '&sort=newest&api-key=' +
//                 nytkey;
//             $.getJSON(nytimesUrl, function(data){
                
//                 articles = data.response.docs;
//                 for (var i = 0; i < articles.length; i++) {
//                     var article = articles[i];
//                     $nytElem.append('<li class="article">'+
//                         '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
//                         '<p>' + article.snippet + '</p>'+
//                     '</li>');
//                 };

//                 //infowindow.setContent(this.htmlContent + this.nytApiContent);
//             }).error(function() {
//                 alert("There was an issue loading the NYT-Article API.");
//             });


//     // load wikipedia data
//     var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + location + '&format=json&callback=wikiCallback';
//     var wikiRequestTimeout = setTimeout(function(){
//         $wikiElem.text("failed to get wikipedia resources");
//     }, 8000);

//     $.ajax({
//         url: wikiUrl,
//         dataType: "jsonp",
//         jsonp: "callback",
//         success: function( response ) {
//             var articleList = response[1];

//             for (var i = 0; i < articleList.length; i++) {
//                 articleStr = articleList[i];
//                 var url = 'http://en.wikipedia.org/wiki/' + articleStr;
//                 $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
//             };

//             clearTimeout(wikiRequestTimeout);
//         }
//     });

//     return false;
// };

// $('#form-container').submit(loadData);
