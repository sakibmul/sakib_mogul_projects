 // Main Map	

 let myMap = L.map('map').setView([0, 0], 1);
    
 let attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

 let tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

 let tiles = L.tileLayer(tileUrl, {attribution});

 tiles.addTo(myMap);

// Button options L.easyButton plugin
let countryInfo = L.easyButton('<strong>i<strong>', function(){
$('#myModal').modal('show');
}).addTo(myMap);  

let financialInfo = L.easyButton('fas fa-pound-sign', function(){
$('#myModal1').modal('show');
}).addTo(myMap);

let weatherInfo = L.easyButton('fas fa-cloud-sun', function(){
$('#myModal2').modal('show');
}).addTo(myMap);

let cityInfo = L.easyButton('fas fa-city', function(){

}).addTo(myMap);

let wikiInfo = L.easyButton('fab fa-wikipedia-w', function(){
$('#myModal3').modal('show');
}).addTo(myMap);

// Adding Awesome Markers
/*let marker = L.AwesomeMarkers.icon({
   icon: 'home',
   markerColor: 'red',
   prefix: 'fa'
});*/

let wikiMarker = L.AwesomeMarkers.icon({
   icon: 'flag',
   markerColor: 'purple',
   prefix: 'fa'
});

// Knowing your location
if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(success);

function success(pos) {
   console.log(pos.coords.latitude);
   console.log(pos.coords.longitude);

   let latitude = pos.coords.latitude;
   let longitude = pos.coords.longitude;

   let home = L.AwesomeMarkers.icon({
      icon: 'home',
      prefix: 'fa'
   });
   L.marker([latitude, longitude], {icon: home}).addTo(myMap).bindPopup('You are here!').openPopup();
   

// ajax call to come within the success function. Call to trigger Country Drop down on load
$.ajax({
   url: "libs/php/getCountryName.php",
   type: "GET",
   dataType: "json",
   data: {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
   },
   success: function(result) {
      console.log(result);
      $('#countryDropdown').val(result['data']['countryCode']).change();
   },
   error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
   }
});// End of Country DRop down trigger 
function error (err) {
   console.log(err);
}

// Call for user current user weather and forecast.
$.ajax({
   url: "libs/php/getUserWeather.php",
   type: "GET",
   dataType: "json",
   data: {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude
   },
   success: function(userResult) {
      console.log(userResult);
      
      $('#userTemp').html('Current Location Temperature: ' + userResult['data']['current']['temp'] + ' Celsius');
      $('#userDes').html('Current Weather Description: ' + userResult['data']['current']['weather'][0]['description']);
      $('#userLoc').html('The Users Location Weather Symbol is: ')  + $('#userWeatherIcon').attr('src', 'https://openweathermap.org/img/wn/' + userResult['data']['current']['weather'][0]['icon'] + '@2x.png');
      
   },
   error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
   }
});// End of User Weather Location call

// Call for Points Of Interest
$.ajax({
   url: "libs/php/getPoiInfo.php",
   type: "GET",
   dataType: "json",
   data: {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
   },
   success: function(pointsResult) {
      console.log(pointsResult);

      /*
      something to go here
      */

   },
   error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
   }
});// End of POI ajax call

// Call for Wikipedia Entries Nearby
$.ajax({
   url: "libs/php/getWikiEntriesInfo.php",
   type: "GET",
   dataType: "json",
   data: {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
   },
   success: function(result) {
      console.log(result);
      
      for (let i = 0; i < result.data.geonames.length; i++) {
      L.marker([result['data']['geonames'][0]['lat'],
      result['data']['geonames'][0]['lng']], {icon: wikiMarker}).addTo(myMap);
      };

   },
   error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
   }
}); // End of Wiki Entries Nearby

}// End of function success call from Latitude and Longitude
}// End of if statement geolocation call to gain Lat and Long

// Populating the country select
$.ajax({
url: "libs/php/getJsonData.php",
type: 'GET', 
dataType: 'json',
success: function (dropResult) {
   console.log(dropResult);
   
   $.each(dropResult.data, function(index) {
      $('#countryDropdown').append($('<option>', {
      text: dropResult.data[index].name,
      value: dropResult.data[index].isoCode
   }));
   });
},
error: function (jqXHR, textStatus, errorThrown) {
   console.log(errorThrown);
   console.log(textStatus);
   console.log(jqXHR);
}
});

// Country select feature, highlights and flies to the country!
$('#countryDropdown').change(function() {

   $.ajax({
     url: "libs/php/getJsonGeometry.php",
     type: "GET",
     dataType: "json",
   data: {
      iso_code: $("#countryDropdown").val(),
   },
     success: function (flyResult) {
      console.log(flyResult);
      $('#countryDropdown').change(function() {
         if (border) {
            border.remove(myMap);
         } 
      });

         let border = L.geoJSON(flyResult["data"], {
             style: function () {
                 return {
                     color: '#ba421e'
                 };
             },
         }).addTo(myMap);
         console.log("border: ", border);
         myMap.fitBounds(border.getBounds());
   },
   error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
   },
});

// Country info call
$.ajax({
   url: "libs/php/getCountryInfo.php",
   type: "POST",
   dataType: "json",
   data: {
         country: $('#countryDropdown').val()
   },
   success: function(infoResult) {
      console.log(infoResult);

      if (infoResult.status.name == "ok")  {

         $('.modal-title').html(infoResult['data'][0]['countryName']);
         $('#continent').html(infoResult['data'][0]['continentName']);
         $('#capital').html(infoResult['data'][0]['capital']);
         $('#language').html(infoResult['data'][0]['languages']);
         $('#population').html(infoResult['data'][0]['population']);
         $('#area').html(infoResult['data'][0]['areaInSqKm']);	
         	
      // Wikipedia button function.
         $('#wikiButton').click(function(){
            
            $.ajax({
               url: "libs/php/getWikiInfo.php",
               type: "POST",
               dataType: "json",
               data: {
                     q: infoResult['data'][0]['countryName'],
               },
               success: function(wikiResult) {
                  console.log(wikiResult);
                  $('#myModal4').modal('show');
                  $('#wikiSumm').html(wikiResult['data'][0]['summary']);
                  $('#wikiUrl').html('<a href="https://' + wikiResult['data'][0]['wikipediaUrl'] + '">' + wikiResult['data'][0]['wikipediaUrl'] + '</a>');
               },
                  error: function(jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
               },
            });
         });// End of WikiButton call
      
      // Weather info call for Capital city
      $.ajax({
         url: "libs/php/getWeatherInfo.php",
         type: "POST",
         dataType: "json",
         data: {
               capital: infoResult['data'][0]['capital'],
         },
         success: function(weatherResult) {
            console.log(weatherResult);
      
            $('#capTemp').html('Current Temperature in ' + infoResult['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['main']['temp'] + ' Celsius');
            $('#weatherMain').html('The Main Weather Description in ' + infoResult['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['weather'][0]['main']);
            $('#weatherDes').html('Weather Description in ' + infoResult['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['weather'][0]['description']);
            $('#windSpeed').html('The Wind Speed in ' + infoResult['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['wind']['speed'] + ' m/s');
            $('#capName').html('The Weather Symbol for ' + infoResult['data'][0]['capital'] + ' today is:') + $('#weatherIcon').attr('src', 'https://openweathermap.org/img/wn/' + weatherResult['data']['list'][0]['weather'][0]['icon'] + '@2x.png');
            
         },
            error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
         },
      });// End of weather info call
      
      
      }
   },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
   },
});// End of Country Info call

// Rest Country call
$.ajax({
   url: "libs/php/getRestCountryData.php",
   type: 'POST',
   dataType: 'json',
   data:{
         name: $("#countryDropdown").val(),
   },
   
      success: function(restResult){
         console.log(restResult);

         if (restResult.status.name == 'ok') {

            $('#currencyCode').html(restResult['data'][0]['currencies'][0]['code']);	
            $('#currencyName').html(restResult['data'][0]['currencies'][0]['name']);
            $('#currencySymbol').html(restResult['data'][0]['currencies'][0]['symbol']);
            $('.flag').attr('src', restResult['data'][0]['flags']['svg']);

            $.ajax({
               url: "libs/php/getJsonExRate.php",
               type: "POST",
               dataType: "json",
               data: {
                     currencyCode: restResult['data'][0]['currencies'][0]['code'],
               },
               success: function(currResult) {
                   console.log(currResult);
                  $('#exRate').html(currResult['data']['rates'][restResult['data'][0]['currencies'][0]['code']]).append(' To 1 US Dollar.');
               },
            
               error: function(jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
               }
            });// End of second ajax call
         }
      },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
   },
});// End of Rest Country call

// Next api call







});// on change function end

