var open = require('open');
// open('http://cssdeck.com');

var geocoder = require('geocoder');
 
// Geocoding
geocoder.geocode("Atlanta, GA", function ( err, data ) {
  // do something with data$
  console.log(data)
});