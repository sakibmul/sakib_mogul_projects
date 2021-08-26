 // Main Map	
 let myMap = L.map('map').setView([0, 0], 1);
    
 let attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

 let tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

 let tiles = L.tileLayer(tileUrl, {attribution});

 tiles.addTo(myMap);

// Button options L.easyButton plugin
L.easyButton('<strong>i<strong>', function(){
$('#myModal').modal('show');
}).addTo(myMap);  

L.easyButton('fas fa-pound-sign', function(){
$('#myModal1').modal('show');
}).addTo(myMap);

L.easyButton('fas fa-cloud-sun', function(){
$('#myModal2').modal('show');
}).addTo(myMap);

L.easyButton('fas fa-city', function(){

}).addTo(myMap);

L.easyButton('fab fa-wikipedia-w', function(){
$('#myModal3').modal('show');
}).addTo(myMap);

// Knowing your location
function onLocationFound(e) {
L.marker(e.latlng).addTo(myMap).bindPopup("You are here!").openPopup();
}
myMap.on('locationfound', onLocationFound);
myMap.locate({setView: true, maxZoom: 12});

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
      console.log(result);
         let border = L.geoJSON(result["data"], {
             style: function () {
                 return {
                     color: '#ba421e'
                 };
             }
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
         $('#currencyCode').html(result['data'][0]['currencyCode']);		
      
      }
   },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
   },
});

// Rest Country call
$.ajax({
   url: "libs/php/getRestCountryData.php",
   type: 'POST',
   dataType: 'json',
   data:{
       country : $("#countryDropdown").val(),
   },
   
      success: function(result){

         console.log(JSON.stringify(result));

         if (result.status.name == 'ok') {

            $('#currencyName').html(result['data']['currencies'][0]['name']);
            $('#currencySymbol').html(result['data']['currencies'][0]['symbol']);
            $('#flag').attr('src', result['data']['flag']); 

         }
      },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
   },
});
// Exchange Rate compared to the US Dollar
$.ajax({
   url: "libs/php/getJsonExRate.php",
   type: "POST",
   dataType: "json",
   data: {
         currencyCode: $('#currencyCode').val(),
   },
   success: function(result) {
      
      console.log(JSON.stringify(result));

      if (result.status.name == "ok")  {

         $('#exRate').html(result['data']['rates']);
         
      }
   },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
   },
});
// Next api call:




// On change function end.
});

