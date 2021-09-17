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

// Knowing your location
/*function onLocationFound(e) {
L.marker(e.latlng).addTo(myMap).bindPopup("You are here!").openPopup();
}
myMap.on('locationfound', onLocationFound);
myMap.locate({setView: true, maxZoom: 12});*/

/*myMap.addControl(L.control.locate({
   locateOptions: {
           maxZoom: 12
}}));*/

if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(success);
}
function success(pos) {
   console.log(pos.coords.latitude);
   console.log(pos.coords.longitude);
// ajax call to come within the success function.
$.ajax({
   url: "libs/php/getCountryCode.php",
   type: "GET",
   dataType: "json",
   data: {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
   },
   success: function(result) {
      console.log(result);
      $('#countryDropdown').val(result["data"].toUpperCase()).change();
   }
});
function error(err) {
   console.log(err);
}
}// end of success function call

// Populating the country select
$.ajax({
url: "libs/php/getJsonData.php",
type: 'GET', 
dataType: 'json',
success: function (result) {
   $('#countryDropdown').append('<option value="make selection"selected disabled>Select a Country</option>');
   
   $.each(result.data, function(index) {
      $('#countryDropdown').append($('<option>', {
      text: result.data[index].name,
      value: result.data[index].isoCode
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
     success: function (result) {

      $('#countryDropdown').change(function() {
         if (border) {
            border.remove(myMap);
         } 
      });

      
      console.log(result);
         let border = L.geoJSON(result["data"], {
             style: function () {
                 return {
                     color: '#ba421e'
                 };
             },
         }).addTo(myMap);
         console.log("border: ", border);
         myMap.fitBounds(border.getBounds());
   },
   error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
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
   success: function(result) {
      
      console.log(JSON.stringify(result));

      if (result.status.name == "ok")  {

         $('.modal-title').html(result['data'][0]['countryName']);
         $('#continent').html(result['data'][0]['continentName']);
         $('#capital').html(result['data'][0]['capital']);
         $('#language').html(result['data'][0]['languages']);
         $('#population').html(result['data'][0]['population']);
         $('#area').html(result['data'][0]['areaInSqKm']);	
         	
      // Wikipedia button function.
         $('#wikiButton').click(function(){
            
            $.ajax({
               url: "libs/php/getWikiInfo.php",
               type: "POST",
               dataType: "json",
               data: {
                     q: result['data'][0]['countryName'],
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
               capital: result['data'][0]['capital'],
         },
         success: function(weatherResult) {
            console.log(weatherResult);
      
            $('#capTemp').html('Current Temperature in ' + result['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['main']['temp'] + ' Celsius');
            $('#weatherMain').html('The Main Weather Description in ' + result['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['weather'][0]['main']);
            $('#weatherDes').html('Weather Description in ' + result['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['weather'][0]['description']);
            $('#windSpeed').html('The Wind Speed in ' + result['data'][0]['capital'] + ' is:').append(' ' + weatherResult['data']['list'][0]['wind']['speed'] + ' m/s');
            $('#capName').html('The Weather Symbol for ' + result['data'][0]['capital'] + ' today is:') + $('#weatherIcon').attr('src', 'https://openweathermap.org/img/wn/' + weatherResult['data']['list'][0]['weather'][0]['icon'] + '@2x.png');
            
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
         country : $("#countryDropdown").val(),
   },
   
      success: function(restResult){

         console.log(JSON.stringify(restResult));

         if (restResult.status.name == 'ok') {

            $('#currencyCode').html(restResult['data']['currencies'][0]['code']);	
            $('#currencyName').html(restResult['data']['currencies'][0]['name']);
            $('#currencySymbol').html(restResult['data']['currencies'][0]['symbol']);
            $('.flag').attr('src', restResult['data']['flag']);

            $.ajax({
               url: "libs/php/getJsonExRate.php",
               type: "POST",
               dataType: "json",
               data: {
                     currencyCode: restResult['data']['currencies'][0]['code'],
               },
               success: function(currResult) {
                   console.log(currResult);
                  $('#exRate').html(currResult['data']['rates'][restResult['data']['currencies'][0]['code']]).append(' To 1 US Dollar.');
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

