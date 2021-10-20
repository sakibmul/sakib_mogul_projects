 // Pre Loader
 $(window).on('load', function () {
    if ($('#preloader').length) {
       $('#preloader').delay(1000).fadeOut('slow',function () 
       {$(this).remove();
      });
   }}
);

// Info Modal on initial load
$(window).on('load', function() {
   $('#infoModal').modal('show');
});
setTimeout(function() {
   $('#infoModal').modal('hide');
}, 20000);

 // Main Map	

 let myMap = L.map('map');
    
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

let emissionInfo = L.easyButton('far fa-newspaper', function(){
$('#myModal3').modal('show');
}).addTo(myMap);

let wikiInfo = L.easyButton('fab fa-wikipedia-w', function(){
$('#myModal4').modal('show');
}).addTo(myMap);

// Creating Layers for Markers and Marker Cluster
let cityLayer = L.layerGroup().addTo(myMap);
let markerCluster = L.markerClusterGroup().addTo(myMap);

let wikiMarker = L.AwesomeMarkers.icon({
   icon: 'star',
   markerColor: 'purple',
   prefix: 'fa'
});

let cityMarker = L.AwesomeMarkers.icon({
   icon: 'fas fa-city',
   markerColor: 'red',
   prefix: 'fa'
});

let dateTime = new Date();
$('.dateTime').html(dateTime);

// Knowing your location
if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(success);

   function success(pos) {
      console.log(pos.coords.latitude);
      console.log(pos.coords.longitude);

      let latitude = pos.coords.latitude;
      let longitude = pos.coords.longitude;

// Ajax call to come within the success function. Call to trigger Country Drop down on load
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
   });// End of Country Drop down trigger 
   function error (err) {
   console.log(err);
   }

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
         $('#area').html(Math.round(infoResult['data'][0]['areaInSqKm']));	
         	
      // Wikipedia function.
            $.ajax({
               url: "libs/php/getWikiInfo.php",
               type: "POST",
               dataType: "json",
               data: {
                     capitalCity: infoResult['data'][0]['capital'],
               },
               success: function(wikiResult) {
                  console.log(wikiResult);

                     $('#wikiSumm').html(wikiResult['data']['geonames'][0]['summary']);
                     $('#wikiUrl').html('<a href="https://' + wikiResult['data']['geonames'][0]['wikipediaUrl'] + '">'  + wikiResult['data']['geonames'][0]['wikipediaUrl'] + '</a>');
                     
               },
                  error: function(jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
               },
            });
      
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

            $('#capTemp').html(Math.round(weatherResult['data']['list'][0]['main']['temp']) + ' C');
            $('#weatherDes').html(weatherResult['data']['list'][0]['weather'][0]['description']);
            $('#windSpeed').html(Math.round(weatherResult['data']['list'][0]['wind']['speed'] * 3.6) + ' km/h');
            $('#capWeatherIcon').attr('src', 'https://openweathermap.org/img/wn/' + weatherResult['data']['list'][0]['weather'][0]['icon'] + '@2x.png');
      },
            error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
         },
      });// End of weather info call
      
   // Country Headline Call
      $.ajax({
         url: "libs/php/getCountryNews.php",
         type: "POST",
         dataType: "json",
         data: {
               code: $('#countryDropdown').val(),
         },
         success: function(newsResult) {
            console.log(newsResult);
      
            $('#newsHead1').html(newsResult['data']['articles'][0]['source']['name']);
            $('#news1').html('<a href="https://' + newsResult['data']['articles'][0]['url'] + '">'  + newsResult['data']['articles'][0]['url'] + '</a>');

            $('#newsHead2').html(newsResult['data']['articles'][1]['source']['name']);
            $('#news2').html('<a href="https://' + newsResult['data']['articles'][1]['url'] + '">'  + newsResult['data']['articles'][1]['url'] + '</a>');

            $('#newsHead3').html(newsResult['data']['articles'][2]['source']['name']);
            $('#news3').html('<a href="https://' + newsResult['data']['articles'][2]['url'] + '">'  + newsResult['data']['articles'][2]['url'] + '</a>');

            $('#newsHead4').html(newsResult['data']['articles'][3]['source']['name']);
            $('#news4').html('<a href="https://' + newsResult['data']['articles'][3]['url'] + '">'  + newsResult['data']['articles'][3]['url'] + '</a>');

            $('#newsHead5').html(newsResult['data']['articles'][4]['source']['name']);
            $('#news5').html('<a href="https://' + newsResult['data']['articles'][4]['url'] + '">'  + newsResult['data']['articles'][4]['url'] + '</a>');
            
         },
            error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
         },
      });// End of news api call

   // Rest Country Data Call
      $.ajax({
         url: "libs/php/getRestCountryData.php",
         type: 'POST',
         dataType: 'json',
         data:{
               code: $("#countryDropdown").val(),
         },
         success: function(restResult){
               console.log(restResult); 
      
               if (restResult.status.name == 'ok') {
         
                  $('#currencyCode').html(restResult['data']['currencies'][0]['code']);
                  $('#currencyName').html(restResult['data']['currencies'][0]['name']);
                  $('#currencySymbol').html(restResult['data']['currencies'][0]['symbol']);
                  $('.flag').attr('src', restResult['data']['flags']['svg']);
                  
                  $.ajax({
                     url: "libs/php/getJsonExRate.php",
                     type: "POST",
                     dataType: "json",
                     data: {
                           currencyCode: restResult['data']['currencies'][0]['code'],
                     },
                     success: function(currResult) {
                         console.log(currResult);
                        
                         $('#exRate').html(restResult['data']['currencies'][0]['symbol']).append(' ' + currResult['data']['rates'][restResult['data']['currencies'][0]['code']].toFixed(2));
                     },             
                  
                     error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                     }
                  });// End of Exchange Rate ajax call
               }
            },
            error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
         },
      });// End of Rest Country call

   }
   },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
   },
});// End of Country Info call

 // Cities API Call and adding Markers
 $.ajax({
   url: "libs/php/getCitiesMarker.php",
   type: "GET",
   dataType: "json",
   data: {
         country: $('#countryDropdown').val(),
   },
   success: function(cityResult) {
   console.log(cityResult);

   for (let c = 0; c < cityResult.data.geonames.length; c++) {
      let marker = L.marker([cityResult['data']['geonames'][c]['lat'],
         cityResult['data']['geonames'][c]['lng']], {icon: cityMarker})
         .on('click', markerClick).addTo(cityLayer);
      
      function markerClick() {  

         markerCluster.clearLayers();

         myMap.setView([cityResult['data']['geonames'][c]['lat'], cityResult['data']['geonames'][c]['lng']], 16);

         $.ajax({
            url: "libs/php/getLocWeather.php",
            type: "GET",
            dataType: "json",
            data: {
               lat: cityResult['data']['geonames'][c]['lat'],
               lon: cityResult['data']['geonames'][c]['lng']
            },
            success: function(result) {
               console.log(result);

               let iconResult = result['data']['current']['weather'][0]['icon'];              
               let iconImage = "https://openweathermap.org/img/wn/" + iconResult + '@2x.png';

               marker.bindPopup(cityResult['data']['geonames'][c]['name'] + '<br><br>' + 'Population ' + cityResult['data']['geonames'][c]['population'] + '<br>' + 'Temperature ' + Math.round(result['data']['current']['temp']) + ' C' + '<br>' + result['data']['current']['weather'][0]['description'] + '<br>' + "<img src='" + iconImage + "'</img>").openPopup().addTo(cityLayer);

            }, 
            error: function (jqXHR, textStatus, errorThrown) {
               console.log(errorThrown);
               console.log(textStatus);
               console.log(jqXHR);
            }
         });

         // Nearby City Wiki Entries
         $.ajax({
            url: "libs/php/getWikiEntriesInfo.php",
            type: "GET",
            dataType: "json",
            data: {
               lat: cityResult['data']['geonames'][c]['lat'],
               lng: cityResult['data']['geonames'][c]['lng']
            },
            success: function(result) {
               console.log(result);
            
               for (let i = 0; i < result.data.geonames.length; i++) {
               L.marker([result['data']['geonames'][i]['lat'],
               result['data']['geonames'][i]['lng']], {icon: wikiMarker})
               .addTo(markerCluster).bindPopup('<a href="https://' + result['data']['geonames'][i]['wikipediaUrl'] + '">' + result['data']['geonames'][i]['wikipediaUrl'] + '</a>');
            };                                              
         },
         error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         }
      }); // End of Wiki Entries Nearby
      
   };// End of marker click function

   };

},
error: function (jqXHR, textStatus, errorThrown) {
   console.log(errorThrown);
   console.log(textStatus);
   console.log(jqXHR);
}
});// End of city marker call

// Clearing all Markers on Country change
markerCluster.clearLayers();
cityLayer.clearLayers();



});// On change function end

